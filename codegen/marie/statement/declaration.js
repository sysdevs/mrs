const CodeGenerationError = require('../../codegen-error')

module.exports = (node, codeGen) => {
    if (codeGen.variablePool.mapping.has(node.name)) {
        throw new CodeGenerationError(`multiple definition of symbol: ${node.name}`)
    }

    codeGen.variablePool.find(node.name)
}
