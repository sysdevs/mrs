const keywords = require('../../keywords')
const ParseError = require('../parse-error')

module.exports.shouldParse = token => {
    return keywords.controlFlow.includes(token.lexeme) && token.type === 'keyword'
}

module.exports.parse = (parent, token, tree) => {
    console.log(token)
    return null
}
