/**
 * Type definitions for JEON expressions
 */
type JeonPrimitive = string | number | boolean | null
type JeonArray = JeonValue[]
export type JeonObject = { [key: string]: JeonValue }
type JeonValue = JeonPrimitive | JeonArray | JeonObject

export interface JeonOperatorMap {
    // Arithmetic operators
    '+': JeonArray // { '+': [15, 9] } - Addition operator
    '-': JeonArray // { '-': [15, 9] } - Subtraction operator
    '*': JeonArray // { '*': [15, 9] } - Multiplication operator
    '/': JeonArray // { '/': [15, 9] } - Division operator
    '%': JeonArray // { '%': [15, 9] } - Modulo operator

    // Comparison operators
    '==': JeonArray // { '==': [15, 9] } - Equality operator
    '===': JeonArray // { '===': [15, 9] } - Strict equality operator
    '!=': JeonArray // { '!=': [15, 9] } - Inequality operator
    '!==': JeonArray // { '!==': [15, 9] } - Strict inequality operator
    '<': JeonArray // { '<': [15, 9] } - Less than operator
    '>': JeonArray // { '>': [15, 9] } - Greater than operator
    '<=': JeonArray // { '<=': [15, 9] } - Less than or equal operator
    '>=': JeonArray // { '>=': [15, 9] } - Greater than or equal operator
    'instanceof': JeonArray // { 'instanceof': [operand1, operand2] } - Instanceof operator

    // Logical operators
    '&&': JeonArray // { '&&': [15, 9] } - Logical AND operator
    '||': JeonArray // { '||': [15, 9] } - Logical OR operator
    '!': JeonValue // { '!': [15, 9] } - Logical NOT operator
    '~': JeonValue // { '~': [15, 9] } - Bitwise NOT operator

    // Bitwise operators
    '&': JeonArray // { '&': [15, 9] } - Bitwise AND operator
    '|': JeonArray // { '|': [15, 9] } - Bitwise OR operator
    '^': JeonArray // { '^': [15, 9] } - Bitwise XOR operator

    // Bitwise shift operators
    '<<': JeonArray // { '<<': [15, 9] } - Left shift operator
    '>>': JeonArray // { '>>': [15, 9] } - Right shift operator
    '>>>': JeonArray // { '>>>': [15, 9] } - Unsigned right shift operator

    // Extended unary operators
    'typeof': JeonValue // { 'typeof': "@a" } - Typeof operator
    'void': JeonValue // { 'void': expression } - Void operator
    'delete': JeonValue  // { 'delete': {'.':["@obj", "prop"]}} - Delete operator

    // Special operators
    '(': JeonValue // { '(': expression } - Grouping operator
    '?': JeonArray // { '?': [condition, trueValue, falseValue] } - Ternary operator
    '()': JeonArray // { '()': [function, arg1, arg2, ...] } - Function call operator
    '.': JeonArray // { '.': [object, property1, property2, ...] } - Property access operator
    '[]': JeonArray // { '[]': [object, key] } - Bracket notation access operator
    'new': JeonArray // { 'new': [constructor, arg1, arg2, ...] } - New instance operator
    '...': JeonValue // { '...': expression } - Spread operator
    'class': JeonObject // { 'class ClassName': { ... } } - Class definition
    'extends': JeonValue // { 'extends': ParentClass } - Class inheritance
    'static': JeonValue // { 'static': value } - Static property/method

    // Assignment operators
    '=': JeonArray // { '=': [target, value] } - Assignment operator
    '+=': JeonArray // { '+=': [target, value] } - Addition assignment operator
    '-=': JeonArray // { '-=': [target, value] } - Subtraction assignment operator
    '*=': JeonArray // { '*=': [target, value] } - Multiplication assignment operator
    '/=': JeonArray // { '/=': [target, value] } - Division assignment operator
    '%=': JeonArray // { '%=': [target, value] } - Modulo assignment operator
    '<<=': JeonArray // { '<<=': [target, value] } - Left shift assignment operator
    '>>=': JeonArray // { '>>=': [target, value] } - Right shift assignment operator
    '>>>=': JeonArray // { '>>>=': [target, value] } - Unsigned right shift assignment operator
    '&=': JeonArray // { '&=': [target, value] } - Bitwise AND assignment operator
    '^=': JeonArray // { '^=': [target, value] } - Bitwise XOR assignment operator
    '|=': JeonArray // { '|=': [target, value] } - Bitwise OR assignment operator

    // Increment/decrement operators
    '++': JeonValue // { '++': operand } - Prefix increment operator
    '--': JeonValue // { '--': operand } - Prefix decrement operator
    '++.': JeonValue // { '++.': operand } - Postfix increment operator
    '--.': JeonValue // { '--.': operand } - Postfix decrement operator

    // Control flow operators
    'if': JeonArray // { 'if': [condition, trueBlock, falseBlock] } - If statement
    'while': JeonArray // { 'while': [condition, body] } - While loop
    'for': JeonArray // { 'for': [init, condition, increment, body] } - For loop
    'do': JeonArray // { 'do': [body, condition] } - Do-while loop
    'break': JeonValue // { 'break': label } - Break statement
    'continue': JeonValue // { 'continue': label } - Continue statement
    'switch': JeonArray // { 'switch': [expression, cases, default] } - Switch statement
    'case': JeonValue // { 'case': value } - Case statement
    'default': JeonValue // { 'default': body } - Default case

    // Function declaration operators
    'function': JeonArray // { 'function(param1, param2, ...)': [body] } - Function declaration
    'async function': JeonArray // { 'async function(param1, param2, ...)': [body] } - Async function declaration
    'function*': JeonArray // { 'function*(param1, param2, ...)': [body] } - Generator function declaration
    // Arrow function operators
    '()=>': JeonValue // { '()=>': expression } - Parameterless arrow function
    '(param1, param2, ...) =>': JeonValue // { '(param1, param2, ...) =>': body } - Arrow function with parameters
    'return': JeonValue // { 'return': expression } - Return statement
    'yield': JeonValue // { 'yield': expression } - Yield expression
    'yield*': JeonValue // { 'yield*': expression } - Yield delegate expression
    // Async/await operators
    'await': JeonValue // { 'await': expression } - Await expression
    // Comment operators
    '//': JeonValue // { '//': "comment text" } - Single-line comment
    '/*': JeonValue // { '/*': "comment text" } - Block comment
    '/ /': { pattern: string; flags: string } | JeonObject // { '/ /': { pattern: "regex", flags: "gi" } } - Regular expression
    // Sequence operator
    ',': JeonArray // { ',': [item1, item2, ...] } - Sequence operator

    // Variable declaration operators
    '@': JeonObject // { '@': { variableName: initialValue } } - Let/var declaration
    '@@': JeonObject // { '@@': { constantName: initialValue } } - Const declaration
}

export type JeonExpression = JeonValue | {
    [K in keyof JeonOperatorMap]: JeonOperatorMap[K]
}