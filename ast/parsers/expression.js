const ParseError = require('../parse-error')

function parseSymbol(parent, token, tree) {
    const next = tree.peek()

    if (next) {
        if (next.type === 'operator') {
            tree.pop()
            const operand = tree.pop()

            if (!operand) {
                throw ParseError.endOfFile(next, 'expected operand to operator')
            }

            if (operand.type !== 'symbol' && operand.type !== 'number') {
                throw ParseError.token(operand, 'operand expected to be symbol or numeric constant')
            }
            parent.push({
                type: 'expression',
                kind: 'operator',
                operation: next.lexeme,
                left: token.lexeme,
                right: operand.lexeme
            })
        } else if (next.lexeme === '(') {
            const parameters = []
            let cur = tree.peek()

            while (cur && cur.lexeme !== ')') {
                parameters.push(cur)
                cur = tree.pop()
            }

            if (!cur) {
                throw ParseError.endOfFile(next, 'expected closing parenthesis')
            }
            if (cur.lexeme !== ')') {
                throw ParseError.token(cur, 'expected closing parenthesis to function call')
            }

            const expressionTree = new tree.constructor(parameters)

            parent.push({
                type: 'expression',
                kind: 'function-call',
                name: token.lexeme,
                parameters: expressionTree.parse()
            })
        }
    } else {
        parent.push({
            type: 'symbol',
            name: token.lexeme
        })
    }
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

module.exports.shouldParse = token => {
    return token.type !== 'misc'
}

module.exports.parse = (parent, token, tree) => {
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
