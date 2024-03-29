const ParseError = require('../parse-error')

function parseSymbol(parent, token, tree) {
    const next = tree.peek()

    if (next) {
        if (next.type === 'operator') {
            tree.pop()
            const operands = []
            let operand = tree.pop()

            while (operand && operand.type !== 'linebreak') {
                operands.push(operand)
                operand = tree.pop()
            }
    
            const leftTree = new tree.constructor([token])
            leftTree.parse()

            const rightTree = new tree.constructor(operands)
            rightTree.parse()

            parent.push({
                type: 'expression',
                kind: 'operator',
                operation: next.lexeme,
                left: leftTree.ast,
                right: rightTree.ast
            })
        } else if (next.lexeme === '(') {
            const parameters = []
            let cur = tree.pop()

            while (cur && cur.type !== 'linebreak') {
                parameters.push(cur)
                cur = tree.pop()
            }

            const expressionTree = new tree.constructor(parameters)

            parent.push({
                type: 'expression',
                kind: 'function-call',
                name: token.lexeme,
                parameters: expressionTree.parse()
            })
        } else {
            parent.push({
                type: 'expression',
                kind: 'symbol',
                name: token.lexeme
            })
        }
    } else {
        parent.push({
            type: 'expression',
            kind: 'symbol',
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
        case 'linebreak':
            // do nothing on line breaks
            return tree.parse(parent)
        default:
            throw ParseError.token(token, 'unknown token type')
    }
}
