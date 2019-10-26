const fs = require('fs')
const Tokenizer = require('./ast/tokenize')
const SyntaxTree = require('./ast/synxtax-tree')
const ConstantPool = require('./codegen/constant-pool')

const yargs = require('yargs')


const argv = yargs
    .option('ast', {
        alias: 'a',
        description: 'dumps the abrast syntax tree to ast.json',
        type: 'boolean'
    })
    .help()
    .alias('help', 'h')
    .argv

try {
    const source = fs.readFileSync('programs/main.mrs').toString()

    const tokenizer = new Tokenizer(source)
    tokenizer.tokenize()

    const syntaxTree = new SyntaxTree(tokenizer.tokens)
    syntaxTree.parse()

    if (argv.ast) {
        console.log(`dumping AST to ast.json`)
        fs.writeFileSync('ast.json', JSON.stringify(syntaxTree.ast, null, 4))
    }

    const constantPool = new ConstantPool(syntaxTree.ast)
    constantPool.parse()

    console.log(constantPool.constants)
} catch (error) {
    console.error('error while compiling program')
    console.error(error)
}
