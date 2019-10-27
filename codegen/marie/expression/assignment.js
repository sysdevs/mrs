module.exports = (node, codeGen) => {
    for (const expr of node.value) {
        codeGen.generateNode(expr)
    }

    const name = codeGen.variablePool.find(node.name)

    codeGen.popStack()
    codeGen.loadStackPointer()
    codeGen.sourceLayout.pushInstruction('store', name)
}
