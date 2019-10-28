const CodeGenerationError = require('../../codegen-error')

module.exports = (node, codeGen) => {
    let name = codeGen.variablePool.find(node.name, false)

    if (!name) {
        name = codeGen.constantPool.constantName(node.name)
    }

    if (!name) {
        throw new CodeGenerationError(`unknown symbol: ${node.name}`)
    }
    
    codeGen.sourceLayout.pushInstruction('load', name)
}
