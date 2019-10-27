module.exports = (node, codeGen) => {
    for (const expr of node.expression) {
        codeGen.generateNode(expr)
    }

    codeGen.pushStack()
}
