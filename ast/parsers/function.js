const keywords = require('../../keywords')
const ParseError = require('../parse-error')

module.exports.shouldParse = token => {
    return token.lexeme === keywords.funcType && token.type === 'keyword'
}

module.exports.parse = (parent, token, tree) => {
    const name = tree.pop()

    if (!name) {
        throw ParseError.endOfFile(token, 'expected function name')
    } else if (name.type !== 'symbol') {
        throw ParseError.token(name, 'symbol')
    }

    const args = []
    let cur = tree.pop()

    if (!cur) {
        throw ParseError.endOfFile(name, 'expected function body or argument list')
    }

    while (cur && cur.lexeme !== '{' && cur.type === 'symbol') {
        args.push({
            type: 'symbol',
            name: cur.lexeme
        })
        cur = tree.pop()
    }

    if (!cur) {
        throw ParseError.endOfFile(name, 'expected function body')
    }

    let body = tree.parse([])

    parent.push({
        type: 'statement',
        kind: 'function',
        name: name.lexeme,
        arguments: args,
        body: body
    })

    return tree.parse(parent)
}
