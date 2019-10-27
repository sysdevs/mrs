const LabelGenerator = require('./label-generator')

class VariablePool {
    constructor(prefix) {
        this.mapping = new Map()
        this.labelGenerator = new LabelGenerator(`${prefix}var`)
    }
    find(variable) {
        let label = this.mapping.get(variable)

        if (!label) {
            label = this.labelGenerator.next()
            this.mapping.set(variable, label)
        }

        return label
    }
}

module.exports = VariablePool
