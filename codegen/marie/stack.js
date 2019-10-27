class Stack {
    generate(prefix, sourceLayout, constantPool) {
        const name = `${prefix}stack_`
        
        this.addPush(sourceLayout, name)
        this.addPop(sourceLayout, name)

        constantPool.constants.set(`${name}ptr`, 0xC00)
        constantPool.constants.set(`${name}step`, 0x1)
    }
    addPush(sourceLayout, name) {
        const instructions = [
            ['storei', `${name}ptr`],
            ['load', `${name}ptr`],
            ['add', `${name}step`],
            ['store', `${name}ptr`],
        ]

        this.add(`${name}push`, instructions, sourceLayout)
    }
    addPop(sourceLayout, name) {
        const instructions = [
            ['load', `${name}ptr`],
            ['subt', `${name}step`],
            ['store', `${name}ptr`]
        ]

        this.add(`${name}pop`, instructions, sourceLayout)
    }

    add(name, instructionList, sourceLayout) {
        sourceLayout.pushInstruction(`${name},`, 'hex', '0000')
        sourceLayout.begin(4)
        
        for (const inst of instructionList) {
            sourceLayout.pushInstruction(...inst)
        }

        sourceLayout.pushInstruction('jumpi', `${name}`)
        sourceLayout.end(4)
    }
}

module.exports = Stack
