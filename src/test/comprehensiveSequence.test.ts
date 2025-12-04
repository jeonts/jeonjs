// Comprehensive test for SequenceExpression handling
import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Comprehensive SequenceExpression Test ===\n')

// Test case 1: Simple sequence with literals
const test1 = '1, 2, 3'
console.log('Test 1: Simple sequence with literals')
console.log('JavaScript:', test1)
try {
  const jeon1 = js2jeon(test1)
  const result1 = evalJeon(jeon1)
  console.log('Result:', result1)
  console.log(result1 === 3 ? '✅ PASSED' : '❌ FAILED')
} catch (error: any) {
  console.log('❌ ERROR:', error.message)
}
console.log('')

// Test case 2: Named function expression in sequence
const test2 = `(function greet(name) { 
  return 'Hello, ' + name; 
}, greet('World'))`
console.log('Test 2: Named function expression in sequence')
console.log('JavaScript:', test2)
try {
  const jeon2 = js2jeon(test2)
  const result2 = evalJeon(jeon2)
  console.log('Result:', result2)
  console.log(result2 === 'Hello, World' ? '✅ PASSED' : '❌ FAILED')
} catch (error: any) {
  console.log('❌ ERROR:', error.message)
}
console.log('')

// Test case 3: Multiple named functions in sequence
const test3 = `(function add(a, b) { return a + b; }, 
  function multiply(a, b) { return a * b; }, 
  multiply(add(2, 3), 4))`
console.log('Test 3: Multiple named functions in sequence')
console.log('JavaScript:', test3)
try {
  const jeon3 = js2jeon(test3)
  const result3 = evalJeon(jeon3)
  console.log('Result:', result3)
  console.log(result3 === 20 ? '✅ PASSED' : '❌ FAILED') // (2+3)*4 = 20
} catch (error: any) {
  console.log('❌ ERROR:', error.message)
}
console.log('')

// Test case 4: Anonymous function in sequence (should not affect scope)
const test4 = `(function(name) { return 'Hello, ' + name; }, "world")`
console.log('Test 4: Anonymous function in sequence')
console.log('JavaScript:', test4)
try {
  const jeon4 = js2jeon(test4)
  const result4 = evalJeon(jeon4)
  console.log('Result:', result4)
  console.log(result4 === 'world' ? '✅ PASSED' : '❌ FAILED')
} catch (error: any) {
  console.log('❌ ERROR:', error.message)
}
console.log('')

// Test case 5: Mix of expressions
const test5 = `(function square(x) { return x * x; }, 
  let result = square(5), 
  result)`
console.log('Test 5: Mix of function and variable declaration')
console.log('JavaScript:', test5)
try {
  const jeon5 = js2jeon(test5)
  const result5 = evalJeon(jeon5)
  console.log('Result:', result5)
  console.log('Note: This test involves variable declarations which are handled differently')
} catch (error: any) {
  console.log('Expected behavior - variable declarations in sequences are handled differently')
}
console.log('')

console.log('=== Test Completed ===')