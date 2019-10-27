class MemoryOffset {
    constructor(wordOffset, wordSize) {
        this.wordOffset = wordOffset
        this.wordSize = wordSize
    }
    get() {
        return this.wordOffset += this.wordSize
    }
}

module.exports = MemoryOffset
