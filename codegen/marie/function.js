class Function {
    constructor(generator, node) {
        this.generator = generator
        this.node = node
    }
    name() {
        return `${this.generator.prefix}${this.node.name}`
    }
    generate(memoryOffset) {
        let source = `${this.name()}, hex 0000\n`
        memoryOffset += 1

        // add body

        source += `jump ${this.name()}\n`
        memoryOffset += 1
        return [source, memoryOffset]
    }
}

module.exports = Function
