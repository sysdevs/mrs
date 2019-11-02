function generateChild(children, codeGen) {
    const nonPoppableFuncs = ['input', 'printi', 'prints']
    let shouldPop = false

    for (const child of children) {
        if (shouldPop) {
            codeGen.popStack()
            codeGen.loadStackPointer()
            shouldPop = false
        }

        codeGen.generateNode(child)

        if (child.kind === 'function-call' && !nonPoppableFuncs.includes(child.name)) {
            shouldPop = true
        }
    }

    if (shouldPop) {
        codeGen.popStack()
        codeGen.loadStackPointer()
    }
}

function generateIfStatement(node, codeGen, type, ...args) {
    const [parent, end, gen] = args

    const varName = codeGen.variablePool.nextTemp()
    const tempVar = codeGen.variablePool.find(varName)

    generateChild(node.right, codeGen)
    codeGen.sourceLayout.pushInstruction('store', tempVar)

    generateChild(node.left, codeGen)
    codeGen.sourceLayout.pushInstruction('subt', tempVar)
    codeGen.sourceLayout.pushInstruction('skipcond', type)

    let elseLabel = null

    if (parent.else) {
        elseLabel = gen.next()
        codeGen.sourceLayout.pushInstruction('jump', elseLabel)
    } else {
        codeGen.sourceLayout.pushInstruction('jump', end)
    }

    generateChild(parent.body, codeGen)

    if (parent.else) {
        console.log('else =', elseLabel)
        codeGen.sourceLayout.pushInstruction('jump', end)

        codeGen.sourceLayout.pushLabel(elseLabel)
        generateChild(parent.else, codeGen)
    }

    codeGen.variablePool.releaseTemp(varName)
}

function generateAssignmentExpression(node, codeGen) {
    const varName = codeGen.variablePool.find(node.left[0].name)

    generateChild(node.right, codeGen)

    codeGen.sourceLayout.pushInstruction('store', varName)
}

function generateAdditionExpression(node, codeGen) {
    const tempName = codeGen.variablePool.nextTemp()
    const tempVar = codeGen.variablePool.find(tempName)

    generateChild(node.left, codeGen)
    codeGen.sourceLayout.pushInstruction('store', tempVar)

    generateChild(node.right, codeGen)
    codeGen.sourceLayout.pushInstruction('add', tempVar)

    codeGen.variablePool.releaseTemp(tempName)
}

function generateMultiplicationExpression(node, codeGen) {

}

function generateSubtrationExpression(node, codeGen) {
    const tempName = codeGen.variablePool.nextTemp()
    const tempVar = codeGen.variablePool.find(tempName)

    generateChild(node.right, codeGen)
    codeGen.sourceLayout.pushInstruction('store', tempVar)

    generateChild(node.left, codeGen)
    codeGen.sourceLayout.pushInstruction('subt', tempVar)

    codeGen.variablePool.releaseTemp(tempName)
}

module.exports = (node, codeGen, ...args) => {
    switch (node.operation) {
        case '+':
            generateAdditionExpression(node, codeGen)
            break
        case '-':
            generateSubtrationExpression(node, codeGen)
            break
        case '*':
            generateMultiplicationExpression(node, codeGen)
            break
        case '/':
            // not sure if i want to impl this..
            break
        case '=':
            if (args.length > 0) {
                generateIfStatement(node, codeGen, '400', ...args)
            } else {
                generateAssignmentExpression(node, codeGen)
            }
            break
        case '>':
            generateIfStatement(node, codeGen, '800', ...args)
            break
        case '<':
            generateIfStatement(node, codeGen, '000', ...args)
            break
    }
}
