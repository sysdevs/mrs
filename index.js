const fs = require('fs')
const Tokenizer = require('./ast/tokenize')
const SyntaxTree = require('./ast/synxtax-tree')

try {
    const source = fs.readFileSync('programs/main.mrs').toString()

    const tokenizer = new Tokenizer(source)
    tokenizer.tokenize()

    const syntaxTree = new SyntaxTree(tokenizer.tokens)
    syntaxTree.parse()

    fs.writeFileSync('output.json', JSON.stringify(syntaxTree.ast, null, 4))
} catch (error) {
    console.error('error while compiling program')
    console.error(error)
}
