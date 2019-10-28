const LabelGenerator = require('./label-generator')

class VariablePool {
    constructor(prefix) {
        this.mapping = new Map()
        this.labelGenerator = new LabelGenerator(`${prefix}var`)
        this.availableTemps = []
        this.usedTemps = []
    }
    find(variable, create = true) {
        let label = this.mapping.get(variable)

        if (!label && create) {
            label = this.labelGenerator.next()
            this.mapping.set(variable, label)
        }

        return label
    }
    nextTemp() {
        if (this.availableTemps.length === 0) {
            const name = `tmp${this.usedTemps.length}`
            this.usedTemps.push(name)
            return name
        } else {
            const name = this.availableTemps.shift()
            return name
        }
    }
    releaseTemp(name) {
        this.availableTemps.push(name)
    }
}

module.exports = VariablePool
