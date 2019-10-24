const functionParser = require('./parsers/function')
const functionEnd = require('./parsers/scope-end')
const dataTypeParser = require('./parsers/data-types')
const controlFlowParser = require('./parsers/control-flow')
const expressionParser = require('./parsers/expression')

const parsers = [ functionEnd, functionParser, dataTypeParser, controlFlowParser, expressionParser ]

class SyntaxTree {
    constructor(tokens) {
        this.tokens = tokens
        this.ast = []
    }
    parse(parent = this.ast, verbose = false) {
        if (verbose) {
            console.log(`parsing ast: `, this.tokens)
        }
        const token = this.pop()

        if (!token) {
            return parent
        }

        for (const parser of parsers) {            
            if (parser.shouldParse(token)) {
                return parser.parse(parent, token, this)
            }
        }

        return this.parse(parent)
    }
    pop() {
        return this.tokens.length > 0 ? this.tokens.shift() : null
    }
    peek(offset = 0) {
        return this.tokens.length > offset ? this.tokens[offset] : null
    }
}

module.exports = SyntaxTree
