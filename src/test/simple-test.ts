import { evalJeon } from '../safeEval'

// Simple test to verify evalJeon is working
console.log('=== Simple evalJeon Test ===')

// Test 1: Simple arithmetic
const jeon1 = { '+': [1, 2] }
console.log('Test 1 - Simple addition:', evalJeon(jeon1))

// Test 2: Function declaration
const jeon2 = {
  'function(a, b)': [
    { 'return': { '+': ['@a', '@b'] } }
  ]
}
console.log('Test 2 - Function declaration result:', evalJeon(jeon2))
console.log('Test 2 - Type of result:', typeof evalJeon(jeon2))

// Test 3: Calling the function
const func = evalJeon(jeon2)
if (typeof func === 'function') {
  console.log('Test 3 - Calling function with 3, 4:', func(3, 4))
}

// Test 4: Function call with context
const result = evalJeon(jeon2, { a: 5, b: 3 })
console.log('Test 4 - Function with context:', result)
if (typeof result === 'function') {
  console.log('Test 4 - Calling function with context values:', result())
}

// Test 5: JSON.stringify behavior with functions
console.log('Test 5 - JSON.stringify of function:', JSON.stringify(func, null, 2))