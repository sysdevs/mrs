class Variables {
    constructor(variablePool) {
        this.variablePool = variablePool
    }

    generate(sourceLayout) {
        for (const [k, v] of this.variablePool.mapping) {
            sourceLayout.pushInstruction(`${v},`, 'dec 0')
        }
    }
}

module.exports = Variables
