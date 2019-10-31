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
        case '>': {
            const leftName = codeGen.variablePool.nextTemp()
            const leftVar = codeGen.variablePool.find(leftName)

            for (const left of node.left) {
                codeGen.generateNode(left)
            }

            codeGen.sourceLayout.pushInstruction('store', leftVar)

            for (const right of node.right) {
                codeGen.generateNode(right)
            }

            codeGen.sourceLayout.pushInstruction('subt', leftVar)
            codeGen.pushStack()

            codeGen.variablePool.releaseTemp(leftName)
        } break
    }
}
