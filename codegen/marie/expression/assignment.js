module.exports = (node, codeGen) => {
    let isConstant = false
    for (const expr of node.value) {
        codeGen.generateNode(expr)
        isConstant = (expr.kind === 'number' || expr.kind === 'str')
    }

    const name = codeGen.variablePool.find(node.name)

    if (!isConstant) {
        codeGen.popStack()
        codeGen.loadStackPointer()
    }

    codeGen.sourceLayout.pushInstruction('store', name)
}
