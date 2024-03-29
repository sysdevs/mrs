const keywords = require('../keywords')

const whitespace = ch => /^[\s]$/.test(ch)
const alpha = ch => /^[a-zA-Z0-9]$/.test(ch)
const numeric = ch => /^[0-9]$/.test(ch)
const alphanumeric = ch => /^[a-zA-Z0-9_]$/.test(ch)
const operator = ch => /^[\+\-\*\/<>=!]$/.test(ch)
const misc = ch => /^[\(\){}]$/.test(ch)

class Token {
    constructor(lexeme, line, column, type) {
        this.lexeme = lexeme
        this.line = line
        this.column = column
        this.type = type
    }
}

function readWhitespace(tokenizer) {
    tokenizer.startColumn = tokenizer.currentColumn
    if (tokenizer.ch === '\n') {
        tokenizer.lexeme == tokenizer.ch
        tokenizer.tokens.push(new Token(tokenizer.lexeme, tokenizer.line, tokenizer.startColumn, 'linebreak'))
    }
}

function readSymbol(tokenizer) {
    tokenizer.lexeme = ''

    while (alphanumeric(tokenizer.ch)) {
        tokenizer.lexeme += tokenizer.ch
        tokenizer.getch()
    }

    tokenizer.ungetch()
    
    if (tokenizer.lexeme.length > 0) {
        let type = 'symbol'

        if (+tokenizer.lexeme || tokenizer.lexeme === '0') {
            type = 'number'
        } else if (keywords.keywords.includes(tokenizer.lexeme)) {
            type = 'keyword'
        }

        tokenizer.tokens.push(new Token(tokenizer.lexeme, tokenizer.line, tokenizer.startColumn, type))
        tokenizer.lexeme = ''
    }
    tokenizer.startColumn = tokenizer.currentColumn
}

function readOperator(tokenizer) {
    tokenizer.lexeme = tokenizer.ch
    tokenizer.tokens.push(new Token(tokenizer.lexeme, tokenizer.line, tokenizer.startColumn, 'operator'))
    tokenizer.lexeme = ''
    tokenizer.startColumn = tokenizer.currentColumn
}

function readMisc(tokenizer) {
    tokenizer.lexeme = tokenizer.ch
    tokenizer.tokens.push(new Token(tokenizer.lexeme, tokenizer.line, tokenizer.startColumn, 'misc'))
    tokenizer.lexeme = ''
    tokenizer.startColumn = tokenizer.currentColumn
}

function readString(tokenizer) {
    tokenizer.lexeme = ''
    tokenizer.getch()

    while (tokenizer.ch !== `'`) {
        tokenizer.lexeme += tokenizer.ch

        if (tokenizer.ch !== `'`) {
            tokenizer.getch()
        }
    }

    tokenizer.tokens.push(new Token(tokenizer.lexeme, tokenizer.line, tokenizer.startColumn, 'str'))
    tokenizer.lexeme = ''
    tokenizer.startColumn = tokenizer.currentColumn
}

class Tokenizer {
    constructor(source) {
        this.source = source
        this.pos = 0
        this.line = 1
        this.ch = ''
        this.startColumn = 1
        this.currentColumn = 1
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
        } else if (misc(this.ch)) {
            readMisc(this)
        } else if (alpha(this.ch) || numeric(this.ch)) {
            readSymbol(this)
        } else if (operator(this.ch)) {
            readOperator(this)
        } else if (this.ch === `'`) {
            readString(this)
        } else {
            throw new Error(`unexpected character while tokenizing: '${this.ch}'`)
        }

        if (this.pos < this.source.length) {
            this.tokenize()
        }
    }
    getch() {
        if (this.pos >= this.source.length) {
            this.ch = -1
            return
        }

        this.currentColumn += 1
        this.ch = this.source.substr(this.pos++, 1)
    }
    ungetch() {
        if (this.pos <= this.source.length) {
            this.pos -= 1
        }
        this.currentColumn -= 1
    }
}

module.exports = Tokenizer
