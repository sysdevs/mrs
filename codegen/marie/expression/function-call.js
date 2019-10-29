function insertOutputString(sourceLayout) {

}

module.exports = (node, codeGen) => {
    switch (node.name) {
        case 'input':
            codeGen.sourceLayout.pushInstruction('input')
            codeGen.pushStack()
            break
        case 'print':
            // TODO determine if the output type is a string..
            for (const param of node.parameters) {
                codeGen.generateNode(param)
            }

            codeGen.sourceLayout.pushInstruction('output')
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
