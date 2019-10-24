module.exports.shouldParse = token => {
    return token.lexeme === '}' && token.type === 'misc'
}

module.exports.parse = (parent, token, tree) => {
    return parent
}
