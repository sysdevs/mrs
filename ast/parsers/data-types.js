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

    let cur = tree.pop()

    if (!tree.peek()) {
        throw ParseError.endOfFile(cur, 'expected assignment after =')
    }

    cur = tree.pop()

    const expectedType = keywords.intTypes.includes(token.lexeme) ? 'number' : 'str'

    if (cur.type !== expectedType && cur.type !== 'symbol') {
        throw ParseError.token(cur, `expected ${expectedType} or symbol when assigning to type ${token.lexeme}`)
    }

    parent.push({
        type: 'expression',
        kind: 'assignment',
        name: name.lexeme,
        value: cur.type === 'number' ? +cur.lexeme : cur.lexeme,
        valueType: cur.type
    })

    return tree.parse(parent)
}
