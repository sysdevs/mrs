module.exports.shouldParse = token => {
    return token.lexeme === '}' && token.type === 'operator'
}

module.exports.parse = (parent, token, tree) => {
    return parent
}
