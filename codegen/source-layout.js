class SourceLayout {
    constructor(wordSize = 1, capacity = 0xfff) {
        this.wordOffset = 0
        this.wordSize = wordSize
        this.instructions = Array(capacity)
        this.indentCount = 0
    }
    begin(amount = 1) {
        this.indentCount += amount
    }
    end(amount = 1) {
        if (this.indentCount > 0) {
            this.indentCount -= amount
        }
    }
    increment() {
        return Array(this.indentCount + 1).join(' ')
    }
    pushInstruction(instruction, ...operands) {
        const line = `${this.increment()}${instruction} ${operands.join(' ')}`
        
        if (this.instructions.length <= this.wordOffset) {
            throw new Error(`out of memory`)
        }

        this.instructions[this.wordOffset] = line
        this.wordOffset += this.wordSize
    }
    pushString(name, str) {
        this.pushInstruction(`${name}_ptr,`, 'hex', `0x${(this.wordOffset + this.wordSize).toString(16)}`)

        this.pushInstruction(`${name},`, 'dec', str.charCodeAt(0))

        this.begin(4)
        for (let i = 1; i < str.length; i += 1) {
            this.pushInstruction('dec', str.charCodeAt(i))
        }
        this.pushInstruction('dec', 0)
        this.end(4)
    }
}

module.exports = SourceLayout
