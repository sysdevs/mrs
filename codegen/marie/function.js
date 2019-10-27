class Function {
    constructor(generator, node) {
        this.generator = generator
        this.node = node
    }
    name() {
        return `${this.generator.prefix}${this.node.name}`
    }
    generate(sourceLayout) {
        sourceLayout.pushInstruction(`${this.name()},`, 'hex', '0000')
        sourceLayout.begin(4)
        
        // add body
        for (const child of this.node.body) {
            console.log(child)
        }

        sourceLayout.pushInstruction('jumpi', this.name())
        sourceLayout.end(4)
    }
}

module.exports = Function
