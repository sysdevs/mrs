class ParseError extends Error {
    static token(token, expected) {
        const text = `unexpected token '${token.lexeme}', expected ${expected}`
        return new ParseError(text, token)
    }
    static endOfFile(token, expected = null) {
        let text = `unexpected end of file near '${token.lexeme}' ${token.line}:${token.column}`
        if (expected) {
            text += ` ${expected}`
        }
        return new ParseError(text, token)
    }
    constructor(message, token) {
        super(`${message} at ${token.line}:${token.column}`)
    }
}

module.exports = ParseError
