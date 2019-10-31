class PrintStr {
    generate(prefix, sourceLayout, constantPool, variablePool) {
        const name = `${prefix}print_str`

        sourceLayout.pushInstruction(`${name},`, 'hex', '0000')

        sourceLayout.begin(4)
        sourceLayout.pushInstruction('jns', `${prefix}stack_pop`)
        sourceLayout.pushInstruction('loadi', `${prefix}stack_ptr`)
        sourceLayout.end(4)

        const tmpName = variablePool.nextTemp()
        const tmpVar = variablePool.find(tmpName)
        const oneConst = constantPool.constantName(1)

        sourceLayout.pushInstruction(`${name}check_null,`, 'store', tmpVar)
        sourceLayout.begin(4)
        sourceLayout.pushInstruction('loadi', tmpVar)
        sourceLayout.pushInstruction('skipcond', '400')
        sourceLayout.pushInstruction('jump', `${name}print_ch`)
        sourceLayout.pushInstruction('jumpi', name)
        sourceLayout.end(4)

        sourceLayout.pushInstruction(`${name}print_ch,`, 'loadi', tmpVar)
        sourceLayout.begin(4)
        sourceLayout.pushInstruction('output')
        sourceLayout.pushInstruction('load', tmpVar)
        sourceLayout.pushInstruction('add', oneConst)
        sourceLayout.pushInstruction('store', tmpVar)
        sourceLayout.pushInstruction('jump', `${name}check_null`)        
        sourceLayout.end(4)

        variablePool.releaseTemp(tmpVar)
    }
}

module.exports = PrintStr
