module.exports = (node, codeGen) => {
    switch (node.operation) {
        case '+': {
            // TODO make a temp var system?
            // store the first param in a temp variable
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
    }
}
