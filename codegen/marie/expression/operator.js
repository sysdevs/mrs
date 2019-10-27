module.exports = (node, codeGen) => {
    switch (node.operation) {
        case '+':
            // TODO make a temp var system?
            // store the first param in a temp variable
            const tmpVar = codeGen.variablePool.find('tmp0')

            codeGen.popStack()
            codeGen.loadStackPointer()
            codeGen.sourceLayout.pushInstruction('store', tmpVar)

            codeGen.popStack()
            codeGen.loadStackPointer()
            codeGen.sourceLayout.pushInstruction('add', tmpVar)
            break
        case '-':
            break
        case '*':
            break
        case '/':
            break
    }
}
