const ParseError = require('../parse-error')

function parseSymbol(parent, token, tree) {
    return tree.parse(parent)
}

function parseNumber(parent, token, tree) {
    parent.push({
        type: 'expression',
        kind: token.type,
        value: +token.lexeme
    })
    return tree.parse(parent)
}

function parseKeyword(parent, token, tree) {
    return tree.parse(parent)
}

function parseOperator(parent, token, tree) {
    return tree.parse(parent)
}

function parseString(parent, token, tree) {
    parent.push({
        type: 'expression',
        kind: token.type,
        value: token.lexeme
    })
    return tree.parse(parent)
}

module.exports.shouldParse = () => {
    return true
}

module.exports.parse = (parent, token, tree) => {
    console.log('parsing', token)
    switch (token.type) {
        case 'symbol':
            return parseSymbol(parent, token, tree)
        case 'number':
            return parseNumber(parent, token, tree)
        case 'keyword':
            return parseKeyword(parent, token, tree)
        case 'operator':
            return parseOperator(parent, token, tree)
        case 'str':
            return parseString(parent, token, tree)
        default:
            throw ParseError.token(token, 'unknown token type')
    }
}
