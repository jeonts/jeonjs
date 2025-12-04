import { evalJeon } from '../safeEval'

// Test evalJeon with different inputs
console.log('=== evalJeon Test ===')

// Test 1: Simple arithmetic
const jeon1 = { '+': [1, 2] }
console.log('Test 1 - Simple addition:', evalJeon(jeon1))

// Test 1.1: Arithmetic with context variables
const jeon1_1 = { '+': ['@a', '@b'] }
console.log('Test 1.1 - Addition with context {a: 22, b: 33}:', evalJeon(jeon1_1, { a: 22, b: 33 }))

// Test 2: Function declaration
const jeon2 = {
    'function(a, b)': [
        { 'return': { '+': ['@a', '@b'] } }
    ]
}
console.log('Test 2 - Function declaration:', evalJeon(jeon2))

// Test 2.1: Function call
const func = evalJeon(jeon2)
console.log('Function from Test 2:', func)
if (typeof func === 'function') {
    console.log('Calling function with 3, 4:', func(3, 4))
}

// Test 3: Arrow function
const jeon3 = {
    '(a, b) =>': { '+': ['@a', '@b'] }
}
console.log('Test 3 - Arrow function:', evalJeon(jeon3))

// NEW: Call the arrow function with parameters
const arrowFunc = evalJeon(jeon3)
console.log('Arrow function result with params (10, 20):', arrowFunc(10, 20))
console.log('Arrow function result with params (33, 44):', arrowFunc(33, 44))


// Test 5: Direct function call with context
const jeon5 = {
    '()': [
        {
            'function(a, b)': [
                { 'return': { '+': ['@a', '@b'] } }
            ]
        },
        5,
        7
    ]
}
console.log('Test 5 - Direct function call:', evalJeon(jeon5))