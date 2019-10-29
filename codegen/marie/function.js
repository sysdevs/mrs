const CodeGenerationError = require('../codegen-error')

class Function {
    constructor(generator, node) {
        this.generator = generator
        this.node = node
    }
    name() {
        return `${this.generator.prefix}${this.node.name}`
    }
    generate(marieCodeGen) {
        const sourceLayout = marieCodeGen.sourceLayout
    
        sourceLayout.pushInstruction(`${this.name()},`, 'hex', '000')
        sourceLayout.begin(4)
        
        for (const child of this.node.body) {
            this.generator.generateNode(child)
        }

        sourceLayout.pushInstruction('jumpi', this.name())
        sourceLayout.end(4)
    }
}

module.exports = Function
