module.exports = (parent, tree, name) => {
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
