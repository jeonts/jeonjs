import { evalJeon } from '../safeEval'

// Test evalJeon with different inputs
console.log('=== evalJeon Test ===')

// Test 1: Simple arithmetic
const jeon1 = { '+': [1, 2] }
console.log('Test 1 - Simple addition:', evalJeon(jeon1))

// Test 2: Function declaration
const jeon2 = {
    'function(a, b)': [
        { 'return': { '+': ['@a', '@b'] } }
    ]
}
console.log('Test 2 - Function declaration:', evalJeon(jeon2))

// Test 3: Arrow function
const jeon3 = {
    '(a, b) =>': { '+': ['@a', '@b'] }
}
console.log('Test 3 - Arrow function:', evalJeon(jeon3))

// Test 4: Function call
const func = evalJeon(jeon2)
console.log('Function from Test 2:', func)
if (typeof func === 'function') {
    console.log('Calling function with 3, 4:', func(3, 4))
}

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