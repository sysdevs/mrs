const functionParser = require('./expression/function')
const functionEnd = require('./expression/function-end')
const dataTypeParser = require('./expression/data-types')

const parsers = [ functionEnd, functionParser, dataTypeParser ]

class SyntaxTree {
    constructor(tokens) {
        this.tokens = tokens
        this.ast = []
    }
    parse(parent = this.ast) {
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
