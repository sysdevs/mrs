const path = require('path')

const CodeGenerationError = require('./codegen-error')
const ConstantPool = require('./constant-pool')

class CodeGenerator {
    constructor(ast, arch = 'marie', prefix = 'mrs_') {
        this.ast = ast
        this.prefix = prefix
        this.arch = {
            Constants: require(path.resolve(__dirname, arch, 'constants')),
            Function: require(path.resolve(__dirname, arch, 'function'))
        }

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
        const consts = new this.arch.Constants(this.constantPool)
        let memoryOffset = 0

        let source = `jns ${this.prefix}main\n`
        source += 'halt\n'
        memoryOffset += 2

        for (const func of this.functions.values()) {
            const [funcSource, offset] = func.generate(memoryOffset)

            source += funcSource
            memoryOffset += offset
        }

        // lastly, add constants
        source += consts.generate(memoryOffset)
        return source
    }
}

module.exports = CodeGenerator
