const intTypes = ['i8', 'i16', 'i32']
const strType = 'str'
const controlFlow = ['if', 'else', 'return']
const funcType = 'func'
const operators = ['+', '-', '*', '/', '>', '<', '=']

module.exports.intTypes = intTypes
module.exports.strType = strType
module.exports.controlFlow = controlFlow
module.exports.funcType = funcType

module.exports.dataTypes = [...intTypes, strType]
module.exports.keywords = [...intTypes, strType, ...controlFlow, funcType]
