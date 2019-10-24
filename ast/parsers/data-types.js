const keywords = require('../../keywords')
const ParseError = require('../parse-error')

module.exports.shouldParse = token => {
    return keywords.dataTypes.includes(token.lexeme) && token.type === 'keyword'
}

module.exports.parse = (parent, token, tree) => {
    const name = tree.pop()

    if (!name) {
        throw ParseError.endOfFile(token, 'expected variable name')
    } else if (name.type !== 'symbol') {
        throw ParseError.token(name, 'symbol')
    }

    parent.push({
        type: 'statement',
        kind: 'declaration',
        name: name.lexeme,
        dataType: token.lexeme
    })

    if (!tree.peek() || tree.peek().lexeme !== '=') {
        return tree.parse(parent)
    }

    tree.pop()

    const expressions = []
    const validExpressionTypes = ['symbol', 'str', 'operator', 'number', 'misc']

    while (tree.peek() && validExpressionTypes.includes(tree.peek().type)) {
        expressions.push(tree.pop())
    }

    if (expressions.length === 0) {
        throw ParseError.endOfFile(cur, 'expected assignment after =')
    }

    const expressionTree = new tree.constructor(expressions)
    expressionTree.parse()

    parent.push({
        type: 'expression',
        kind: 'assignment',
        name: name.lexeme,
        value: expressionTree.ast
    })

    return tree.parse(parent)
}
