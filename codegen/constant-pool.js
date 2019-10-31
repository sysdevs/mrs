const CodeGenerationError = require('./codegen-error')
const LabelGenerator = require('./label-generator')

class ConstantPool {
    constructor(ast, prefix) {
        this.ast = ast
        this.counter = 0
        this.constants = new Map()
        this.labelGenerator = new LabelGenerator(`${prefix}const`)
    }

    parse(tree = this.ast) {
        for (const element of tree) {
            switch (element.type) {
            case 'statement':
                switch (element.kind) {
                    case 'function':
                        this.parse(element.body)
                        break
                    case 'return':
                        this.parse(element.expression)
                        break
                    case 'if':
                        this.parse(element.predicate)
                        this.parse(element.body)
                        
                        if (element.else) {
                            this.parse(element.else)
                        }
                    default:
                        break
                }
                break

            case 'expression':
                switch (element.kind) {
                    case 'function-call':
                        this.parse(element.parameters)
                        break
                    case 'operator':
                        this.parse(element.left)
                        this.parse(element.right)
                        break
                    case 'assignment':
                        this.parse(element.value)
                        break
                    case 'number':
                        this.set(element.value)
                        break
                    case 'str':
                        this.set(element.value)
                        break
                }
                break
            }
        }
    }

    set(value) {
        for (const [k, v] of this.constants) {
            if (v === value) {
                return k
            }
        }

        const name = `${this.labelGenerator.next()}`
        
        if (this.constants.has(name.toLowerCase())) {
            const other = this.constants.get(name.toLowerCase())

            if (value === other) {
                throw new CodeGenerationError(
                    `multiple definition of variable: ${name}`)
            }
        }
        this.constants.set(name.toLowerCase(), value)
        return name
    }

    constantName(constant, create = true) {
        for (const [k, v] of this.constants) {
            if (v === constant) {
                return k
            }
        }
        if (create) {
            return this.set(constant)
        } else {
            return null
        }
    }
}

module.exports = ConstantPool
