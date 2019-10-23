const whitespace = ch => /[\s]/.test(ch)
const alpha = ch => /[a-zA-Z0-9]/.test(ch)
const numeric = ch => /[0-9]/.test(ch)
const alphanumeric = ch => /[a-zA-Z0-9]/.test(ch)
const operator = ch => /[\+\-\*\/<>=!]/.test(ch)
const misc = ch => /[\(\){}']/.test(ch)

function readWhitespace(tokenizer) {
    tokenizer.startColumn = tokenizer.currentColumn
}

function readSymbol(tokenizer) {
    tokenizer.lexeme = ''

    while (alphanumeric(tokenizer.ch)) {
        tokenizer.lexeme += tokenizer.ch
        tokenizer.getch()
    }
    
    if (tokenizer.lexeme.length > 0) {
        tokenizer.tokens.push(new Token(tokenizer.lexeme, tokenizer.line, tokenizer.startColumn))
        tokenizer.lexeme.length = 0
    }
    tokenizer.startColumn = tokenizer.currentColumn
}

function readOperator(tokenizer) {
    tokenizer.lexeme = tokenizer.ch
    tokenizer.tokens.push(new Token(tokenizer.lexeme, tokenizer.line, tokenizer.startColumn))
    tokenizer.lexeme.length = 0
    tokenizer.startColumn = tokenizer.currentColumn
} 

class Token {
    constructor(lexeme, line, column) {
        this.lexeme = lexeme
        this.line = line
        this.column = column
    }
}

class Tokenizer {
    constructor(source) {
        this.source = source
        this.pos = 0
        this.line = 1
        this.ch = ''
        this.startColumn = 1
        this.currentColumn = 1
        this.currentLexeme = ''
        this.tokens = []
    }
    tokenize() {
        this.getch()

        if (whitespace(this.ch)) {
            readWhitespace(this)
            
            if (this.ch === '\n') {
                this.line += 1
                this.currentColumn = 1
            }
        } else if (alpha(this.ch) || numeric(this.ch)) {
            readSymbol(this)
        } else if (operator(this.ch) || misc(this.ch)) {
            readOperator(this)
        } else {
            throw new Error(`unexpected character: '${ch}'`)
        }

        if (this.pos < this.source.length) {
            this.tokenize()
        }
    }
    getch() {
        this.currentColumn += 1
        this.ch = this.source.substr(this.pos++, 1)
    }
}

module.exports = Tokenizer
