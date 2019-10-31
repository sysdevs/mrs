const CodeGenerationError = require('../../codegen-error')
const LabelGenerator = require('../../label-generator')

module.exports = (node, codeGen) => {
    const labelGen = new LabelGenerator(`${codeGen.prefix}${opCount++}label`)

    for (const predicate of node.predicate) {
        codeGen.generateNode(predicate)
    }
}
