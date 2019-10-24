const keywords = require('../../keywords')
const ParseError = require('../parse-error')

function readReturnStatement(parent, token, tree) {
    const tokens = []
    let next = tree.peek()

    while (next && next.lexeme !== '}') {
        tokens.push(next)
        tree.pop()
        next = tree.peek()
    }

    if (!next) {
        throw ParseError.endOfFile(token, 'expected end of scope')
    }
    if (next.lexeme !== '}') {
        throw ParseError.token(next, 'expected end of scope')
    }

    // wtf at this hack, importing SyntaxTree returns null due to circular dependencies
    const expressionTree = new tree.constructor(tokens)
    expressionTree.parse(expressionTree.ast, true)

    parent.push({
        type: 'statement',
        kind: 'return',
        expressions: expressionTree.ast
    })

    return tree.parse(parent)
}

module.exports.shouldParse = token => {
    return keywords.controlFlow.includes(token.lexeme) && token.type === 'keyword'
}

module.exports.parse = (parent, token, tree) => {
    switch (token.lexeme) {
        case 'if':
            break
        case 'else':
            break
        case 'return':
            return readReturnStatement(parent, token, tree)
        default:
            throw ParseError.token(token, 'expected if/else/return')
    }

    return tree.parse(parent)
}
