const CodeGenerationError = require('../codegen-error')

const Constants = require('./constants')
const Function = require('./function')
const PrintStr = require('./print-str')
const Stack = require('./stack')
const Variables = require('./variables')

const statements = {
    'declaration': require('./statement/declaration'),
    'if': require('./statement/if'),
    'return': require('./statement/return')
}

const expressions = {
    'assignment': require('./expression/assignment'),
    'function-call': require('./expression/function-call'),
    'number': require('./expression/number'),
    'operator': require('./expression/operator'),
    'str': require('./expression/string'),
    'symbol': require('./expression/symbol')
}

class MARIECodeGenerator {
    constructor(codeGenerator) {
        this.codeGenerator = codeGenerator
        this.prefix = codeGenerator.prefix

        this.sourceLayout = codeGenerator.sourceLayout
        this.constantPool = codeGenerator.constantPool
        this.variablePool = codeGenerator.variablePool

        this.functions = new Map()

        this.mapFunctions()
    }

    generate() {
        this.sourceLayout.pushInstruction('jns', `${this.prefix}main`)
        this.sourceLayout.pushInstruction('halt')

        for (const func of this.functions.values()) {
            func.generate(this)
        }

        const printStr = new PrintStr()
        printStr.generate(this.prefix, this.sourceLayout, this.constantPool, this.variablePool)

        const stack = new Stack()
        stack.generate(this.prefix, this.sourceLayout, this.constantPool)

        const consts = new Constants(this.constantPool)
        consts.generate(this.sourceLayout)

        const vars = new Variables(this.variablePool)
        vars.generate(this.sourceLayout)

        return this.sourceLayout.instructions.join('\n')
    }

    generateNode(node, ...args) {
        switch (node.type) {
            case 'statement':
                if (Reflect.has(statements, node.kind)) {
                    statements[node.kind](node, this, ...args)
                } else {
                    console.warn(`unimplemented statement: ${node.kind}`)
                }
                break
            case 'expression':            
                if (Reflect.has(expressions, node.kind)) {
                    expressions[node.kind](node, this, ...args)
                } else {
                    console.warn(`unimplemented expression: ${node.kind}`)
                }
                break
            default:
                throw new CodeGenerationError(`unknown node type ${JSON.stringify(node)}`)
        }
    }

    mapFunctions() {
        for (const node of this.codeGenerator.ast) {
            if (node.type === 'statement' && node.kind === 'function') {
                const func = new Function(this, node)

                this.functions.set(func.name(), func)
            } else {
                throw new CodeGenerationError(`unexpected node in ast root: ${node.type}:${node.kind}`)
            }
        }

        if (!this.functions.has(`${this.prefix}main`)) {
            throw new CodeGenerationError(`main function not found during codegen`)
        }
    }

    pushStack() {
        this.sourceLayout.pushInstruction('jns', `${this.prefix}stack_push`)
    }

    popStack() {
        this.sourceLayout.pushInstruction('jns', `${this.prefix}stack_pop`)
    }

    loadStackPointer() {
        this.sourceLayout.pushInstruction('loadi', `${this.prefix}stack_ptr`)
    }
}

module.exports = MARIECodeGenerator
