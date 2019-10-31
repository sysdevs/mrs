module.exports = (node, codeGen) => {
    const name = codeGen.constantPool.set(node.value)

    codeGen.sourceLayout.pushInstruction('load', `${name}_ptr`)
}
