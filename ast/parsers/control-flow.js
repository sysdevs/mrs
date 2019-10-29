const keywords = require('../../keywords')
const ParseError = require('../parse-error')

function readBody(token, tree, name, open, close) {
    const tokens = []
    let openCount = 1

    let next = token

    if (!next) {
        throw ParseError.endOfFile(token, `while parsing ${name}-statement body`)
    }
    if (next.lexeme !== open) {
        throw ParseError.token(next, `opening to ${name}-statement body`)
    }

    next = tree.pop()

    while (next) {
        if (next.lexeme === open) {
            openCount += 1
        } else if (tree.peek() && tree.peek().lexeme === close) {
            openCount -= 1

            if (openCount === 0) {
                tokens.push(next)
                next = tree.pop()
                break
            }
        }

        tokens.push(next)
        next = tree.pop()
    }

    if (!next) {
        throw ParseError.endOfFile(token, `while parsing ${name}-statement`)
    }
    if (next.lexeme !== close) {
        throw ParseError.token(next, 'closing braces to body')
    }

    const predicateTree = new tree.constructor(tokens)
    predicateTree.parse()

    return predicateTree.ast
}

function readIfStatement(parent, token, tree) {
    let next = tree.pop()

    if (!next || next.lexeme !== '(') {
        throw ParseError.token(next ? next : token, 'predicate after if keyword')
    }

    const predicate = readBody(next, tree, 'predicate', '(', ')')

    if (predicate.length === 0) {
        throw ParseError.token(next, 'expression in if-statement predicate')
    }

    const body = readBody(tree.pop(), tree, 'if', '{', '}')

    const statement = {
        type: 'statement',
        kind: 'if',
        predicate: predicate,
        body: body
    }

    if (tree.peek() && tree.peek().lexeme === 'else' && tree.peek().type === 'keyword') {
        tree.pop()
        const elseBody = readBody(tree.pop(), tree, 'else', '{', '}')

        statement.else = elseBody
    }

    parent.push(statement)

    return tree.parse(parent)
}

function readReturnStatement(parent, token, tree) {
    const tokens = []
    let next = tree.pop()

    // return statements MUST have a } to end their parsing :\
    // possible solution to this is to add statement delimeters (like a semicolon)
    // or enabled whitespace tokens
    while (next && next.lexeme !== '}') {
        tokens.push(next)
        next = tree.pop()
    }

    if (!next) {
        throw ParseError.endOfFile(token, 'expected end of scope')
    }
    if (next.lexeme !== '}') {
        throw ParseError.token(next, 'end of scope')
    }

    // wtf at this hack, importing SyntaxTree returns null due to circular dependencies
    const returnExpression = new tree.constructor(tokens)
    returnExpression.parse()

    parent.push({
        type: 'statement',
        kind: 'return',
        expression: returnExpression.ast
    })

    // 'return' ends the current scope, do not parse any more of the ast
    // at this point.
    return parent
}

module.exports.shouldParse = token => {
    return keywords.controlFlow.includes(token.lexeme) && token.type === 'keyword'
}

module.exports.parse = (parent, token, tree) => {
    switch (token.lexeme) {
        case 'if':
            return readIfStatement(parent, token, tree)
        case 'return':
            return readReturnStatement(parent, token, tree)
        default:
            throw ParseError.token(token, 'if/else/return')
    }
}
