const path = require('path')

const CodeGenerationError = require('./codegen-error')
const ConstantPool = require('./constant-pool')
const SourceLayout = require('./source-layout')

class CodeGenerator {
    constructor(ast, arch = 'marie', prefix = 'mrs_') {
        this.ast = ast
        this.prefix = prefix
        this.arch = {
            Constants: require(path.resolve(__dirname, arch, 'constants')),
            Function: require(path.resolve(__dirname, arch, 'function')),
            Stack: require(path.resolve(__dirname, arch, 'stack')),
        }

        this.sourceLayout = new SourceLayout()
        this.constantPool = new ConstantPool(ast, prefix)

        this.functions = new Map()

        for (const node of this.ast) {
            if (node.type === 'statement' && node.kind === 'function') {
                const func = new this.arch.Function(this, node)

                this.functions.set(func.name(), func)
            } else {
                throw new CodeGenerationError(`unexpected node in ast root: ${node.type}:${node.kind}`)
            }
        }

        if (!this.functions.has(`${this.prefix}main`)) {
            throw new CodeGenerationError(`main function not found during codegen`)
        }

        this.constantPool.parse()
    }

    generate() {
        this.sourceLayout.pushInstruction('jns', `${this.prefix}main`)
        this.sourceLayout.pushInstruction('halt')

        for (const func of this.functions.values()) {
            func.generate(this.sourceLayout)
        }

        const stack = new this.arch.Stack()
        stack.generate(this.prefix, this.sourceLayout, this.constantPool)

        const consts = new this.arch.Constants(this.constantPool)
        consts.generate(this.sourceLayout)

        return this.sourceLayout.instructions.join('\n')
    }
}

module.exports = CodeGenerator
