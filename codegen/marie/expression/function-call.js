module.exports = (node, codeGen) => {
    switch (node.name) {
        case 'input':
            break
        case 'output':
            break
        default:
            for (const param of node.parameters) {
                codeGen.generateNode(param)
                codeGen.pushStack()
            }
            codeGen.sourceLayout.pushInstruction('jns', `${codeGen.prefix}${node.name}`)
            break
    }
}
