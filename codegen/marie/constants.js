class Constants {
    constructor(constantPool) {
        this.constantPool = constantPool
    }

    generate(sourceLayout) {
        for (const [k, v] of this.constantPool.constants) {
            if (typeof(v) === 'string') {
                // must use the NEXT memory address
                sourceLayout.pushString(k, v)
            } else {
                sourceLayout.pushInstruction(`${k},`, 'dec', v)
            }
        }
    }
}

module.exports = Constants
