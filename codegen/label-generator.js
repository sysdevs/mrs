class LabelGenerator {
    constructor(prefix = '') {
        this.prefix = prefix
        this.counter = 0
    }
    next() {
        return `${this.prefix}${this.counter++}`
    }
}

module.exports = LabelGenerator
