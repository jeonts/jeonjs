import { evaluateJeonExpression as evalJeon, js2jeon } from '../index'
import { jeon2js } from '../jeon2js'


// Example 1: Simple arithmetic
const arithmeticExpr = { '+': [1, { '*': [2, 3] }, 4] } // 1 + (2 * 3) + 4 = 11
console.log('Arithmetic result (JEON format):', jeon2js(arithmeticExpr), ' = ', evalJeon(arithmeticExpr))

// Example 2: Conditional expression
const conditionalExpr = { '?': [{ '>': [5, 3] }, 'greater', 'less'] }
console.log('Conditional result (JEON format):', jeon2js(conditionalExpr), ' = ', evalJeon(conditionalExpr))

// Example 3: Using context variables
const context = { x: 10, y: 5 }
const variableExpr = { '*': ['@x', { '+': ['@y', 2] }] } // x * (y + 2) = 10 * 7 = 70
console.log('Variable expression result (JEON format):', jeon2js(variableExpr), ' = ', evalJeon(variableExpr, context))

// Example 4: Object with embedded expressions
const objExpr = {
    name: 'Calculator',
    result: { '+': [1, 2, 3, 4, 5] },
    isActive: { '&&': [true, { '!==': [5, 6] }] }
}
console.log('Object expression result (JEON format):', jeon2js(objExpr), ' = ', evalJeon(objExpr))

// Example 5: Member access
const contextWithMath = { Math }
const memberAccessExpr = {
    '.': ['@Math', 'abs']
}
console.log('Member access result (JEON format):', jeon2js(memberAccessExpr), ' = ', evalJeon(memberAccessExpr as any, contextWithMath))

// Example 6: Function calls with JEON format (new format)
// Math.abs(a + b) where a=3, b=4
const context2 = { a: 3, b: 4, Math }
const functionCallExpr = {
    '()': [
        {
            '.': ['@Math', 'abs']
        },
        {
            '-': ['@a', '@b']
        }
    ]
}
console.log('Function call result (JEON format):', jeon2js(functionCallExpr), ' = ', evalJeon(functionCallExpr as any, context2))

// Example 7: Math.max(a, b) in JEON format
const maxFunctionCallExpr = {
    '()': [
        {
            '.': ['@Math', 'max']
        },
        '@a',
        '@b'
    ]
}
console.log('Math.max result (JEON format):', jeon2js(maxFunctionCallExpr), ' = ', evalJeon(maxFunctionCallExpr as any, context2))

// Example 8: New operator
const contextWithDate = { Date }
const newExpr = {
    'new': ['@Date']
}
console.log('New operator result (JEON format):', jeon2js(newExpr), ' = ', evalJeon(newExpr as any, contextWithDate))

// Example 9: Spread operator
const spreadExpr = {
    '...': [1, 2, 3]
}
console.log('Spread operator result (JEON format):', jeon2js(spreadExpr), ' = ', evalJeon(spreadExpr))

// Example 10: If statement
const context3 = { x: 5 }
const ifExpr = {
    'if': [
        { '>': ['@x', 3] },
        'greater',
        'less'
    ]
}
console.log('If statement result (JEON format):', jeon2js(ifExpr), ' = ', evalJeon(ifExpr as any, context3))

// Example 11: Variable assignment
const context4: Record<string, any> = { x: 5 }
const assignExpr = {
    '=': ['y', { '+': ['@x', 2] }]
}
console.log('Variable assignment result (JEON format):', jeon2js(assignExpr), ' = ', evalJeon(assignExpr as any, context4))
console.log('Context after assignment:', context4)

console.log('All examples completed!')