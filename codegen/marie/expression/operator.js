const CodeGenerationError = require('../../code-generator')

module.exports = (node, codeGen) => {
    switch (node.operation) {
        case '+': {
            const tmpName = codeGen.variablePool.nextTemp()
            const tmpVar = codeGen.variablePool.find(tmpName)

            codeGen.popStack()
            codeGen.loadStackPointer()
            codeGen.sourceLayout.pushInstruction('store', tmpVar)

            codeGen.popStack()
            codeGen.loadStackPointer()
            codeGen.sourceLayout.pushInstruction('add', tmpVar)

            codeGen.variablePool.releaseTemp(tmpName)
        } break
        case '-': {
            const tmpName = codeGen.variablePool.nextTemp()
            const tmpVar = codeGen.variablePool.find(tmpName)

            codeGen.popStack()
            codeGen.loadStackPointer()
            codeGen.sourceLayout.pushInstruction('store', tmpVar)

            codeGen.popStack()
            codeGen.loadStackPointer()
            codeGen.sourceLayout.pushInstruction('subt', tmpVar)

            codeGen.variablePool.releaseTemp(tmpName)
        } break
        case '*':
            break
        case '/':
            break
        case '=': {
            const varName = codeGen.variablePool.find(node.left[0].name)
            let shouldPop = false

            for (const expr of node.right) {
                if (shouldPop) {
                    codeGen.popStack()
                    codeGen.loadStackPointer()
                    shouldPop = false
                }

                codeGen.generateNode(expr)

                if (expr.kind === 'function-call') {
                    shouldPop = true
                }
            }

            if (shouldPop) {
                codeGen.popStack()
                codeGen.loadStackPointer()
            }
    
            codeGen.sourceLayout.pushInstruction('store', varName)
        } break
    }
}
