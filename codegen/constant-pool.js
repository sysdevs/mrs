const CodeGenerationError = require('./codegen-error')

function getOperatorConsts(pool, operator) {

}

class ConstantPool {
    constructor(ast) {
        this.ast = ast
        this.counter = 0
        this.constants = new Map()
    }

    parse(tree = this.ast, prefix = 'mrs__') {
        for (const element of tree) {
            console.log(`parsing const pool ${element.type}: ${element.kind}`)

            switch (element.type) {
            case 'statement':
                switch (element.kind) {
                    case 'function':
                        this.parse(element.body, `${prefix}${element.name}`)
                        break
                    case 'return':
                        this.parse(element.expression, prefix)
                        break
                    case 'if':
                        this.parse(element.predicate, prefix)
                        this.parse(element.body, prefix)
                        
                        if (element.else) {
                            this.parse(element.else, prefix)
                        }
                    default:
                        break
                }
                break

            case 'expression':
                switch (element.kind) {
                    case 'function-call':
                        this.parse(element.parameters, `${prefix}$${element.name}`)
                        break
                    case 'operator':
                        this.parse(element.left, prefix)
                        this.parse(element.right, prefix)
                        break
                    case 'assignment':
                        this.parse(element.value, prefix)
                        break
                    case 'number':
                        this.set(`${prefix}_${element.kind}${this.counter++}`, element.value)
                        break
                    case 'str':
                        this.set(`${prefix}_${element.kind}${this.counter++}`, element.value)
                        break
                }
                break
            }
        }
    }

    set(name, value) {
        if (this.constants.has(name.toLowerCase())) {
            const other = this.constants.get(name.toLowerCase())

            if (value === other) {
                throw new CodeGenerationError(
                    `multiple definition of variable: ${name}`)
            }
        }
        this.constants.set(name.toLowerCase(), value)
    }

    [Symbol.iterator]() {
        return this.constants
    }
}

module.exports = ConstantPool
