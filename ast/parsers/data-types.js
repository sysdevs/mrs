const assignment = require('./assignment')
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

    return assignment(parent, tree, name)
}
