const CodeGenerationError = require('../../codegen-error')
const LabelGenerator = require('../../label-generator')

let opCount = 0

module.exports = (node, codeGen) => {
    const labelGen = new LabelGenerator(`${codeGen.prefix}${opCount++}label`)

    const labelStart = labelGen.next()
    const labelEnd = labelGen.next()

    codeGen.sourceLayout.pushLabel(labelStart)

    for (const predicate of node.predicate) {
        codeGen.generateNode(predicate, node, labelEnd, labelGen)
    }

    codeGen.sourceLayout.pushLabel(labelEnd)
}
