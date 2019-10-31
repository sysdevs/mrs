module.exports = (node, codeGen) => {
    switch (node.name) {
        case 'input':
            codeGen.sourceLayout.pushInstruction('input')
            codeGen.pushStack()
            break
        case 'printi':
            for (const param of node.parameters) {
                codeGen.generateNode(param)
            }
            codeGen.sourceLayout.pushInstruction('output')
            break
        case 'prints':
            for (const param of node.parameters) {
                codeGen.generateNode(param)
                codeGen.pushStack()
            }
            codeGen.sourceLayout.pushInstruction('jns', `${codeGen.prefix}print_str`)
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
