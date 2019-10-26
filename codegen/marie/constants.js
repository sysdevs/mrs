class Constants {
    constructor(constantPool) {
        this.constantPool = constantPool
    }

    generate(memoryOffset) {
        let constSection = ''

        for (const [k, v] of this.constantPool.constants) {
            if (typeof(v) === 'string') {
                // must use the NEXT memory address
                constSection += `${k}_ptr, hex 0x${(memoryOffset + 1).toString(16)}\n`
                memoryOffset += 1

                constSection += `${k},`
                for (let i = 0; i < v.length; i += 1) {
                    constSection += ` dec ${v.charCodeAt(i)}\n`
                    memoryOffset += 1
                }

                // add null terminator
                constSection += ` dec 0\n`
                memoryOffset += 1
            } else {
                constSection += `${k}, dec ${v}\n`
                memoryOffset += 1
            }
        }

        return constSection
    }
}

module.exports = Constants
