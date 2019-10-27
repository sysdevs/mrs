const path = require('path')

const ConstantPool = require('./constant-pool')
const SourceLayout = require('./source-layout')
const VariablePool = require('./variable-pool')

class CodeGenerator {
    constructor(ast, arch = 'marie', prefix = 'mrs_') {
        this.ast = ast
        this.prefix = prefix
        this.arch = require(path.resolve(__dirname, arch, `${arch}-codegen`))

        this.sourceLayout = new SourceLayout()
        this.constantPool = new ConstantPool(ast, prefix)
        this.variablePool = new VariablePool(prefix)

        this.constantPool.parse()
    }

    generate() {
        const generator = new this.arch(this)

        return generator.generate()
    }
}

module.exports = CodeGenerator
