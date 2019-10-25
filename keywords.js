const controlFlow = ['if', 'else', 'return']
const funcType = 'func'
const operators = ['+', '-', '*', '/', '>', '<', '=']
const dataTypes = ['int', 'str']

module.exports.operators = operators

module.exports.controlFlow = controlFlow
module.exports.funcType = funcType
module.exports.dataTypes = dataTypes

module.exports.keywords = [...dataTypes, ...controlFlow, funcType]
