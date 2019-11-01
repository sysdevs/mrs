module.exports = (node, codeGen, ...args) => {
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
            const [parent, end, gen] = args

            const varName = codeGen.variablePool.nextTemp()
            const tempVar = codeGen.variablePool.find(varName)

            for (const right of node.right) {
                codeGen.generateNode(right)
            }

            codeGen.sourceLayout.pushInstruction('store', tempVar)

            for (const left of node.left) {
                codeGen.generateNode(left)
            }

            codeGen.sourceLayout.pushInstruction('subt', tempVar)
            codeGen.sourceLayout.pushInstruction('skipcond', '800')

            let elseLabel = null

            if (parent.else) {
                elseLabel = gen.next()
                codeGen.sourceLayout.pushInstruction('jump', elseLabel)
            } else {
                codeGen.sourceLayout.pushInstruction('jump', end)
            }
            
            for (const childNode of parent.body) {
                codeGen.generateNode(childNode)
            }

            if (parent.else) {
                codeGen.sourceLayout.pushInstruction('jump', end)

                codeGen.sourceLayout.pushLabel(elseLabel)
                for (const childNode of parent.else) {
                    codeGen.generateNode(childNode)
                }
            }
            codeGen.variablePool.releaseTemp(varName)
        } break
    }
}
