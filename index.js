const fs = require('fs')
const Tokenizer = require('./tokenize')

const source = fs.readFileSync('programs/main.mrs').toString()
const tokenizer = new Tokenizer(source)

try {
tokenizer.tokenize()

console.log(tokenizer.tokens)
} catch (error) {
    console.error(`error while compiling program`)
    console.error(error)
}
