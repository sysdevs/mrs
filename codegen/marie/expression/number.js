module.exports = (node, codeGen) => {
    const name = codeGen.constantPool.constantName(node.value)

    codeGen.sourceLayout.pushInstruction('load', name)
}
