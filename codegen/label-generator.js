class LabelGenerator {
    constructor(prefix = '') {
        this.prefix = prefix
        this.counter = 0
    }
    next() {
        return `${this.prefix}_const${this.counter++}`
    }
}

module.exports = LabelGenerator
