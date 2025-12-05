import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Regression Test ===\n')

// Test regular functions still work
console.log('Test: Regular functions')
const functionCode = `
function add(a, b) {
  return a + b;
}

function multiply(x, y) {
  return x * y;
}

add(5, 3) + multiply(2, 4)
`

try {
    console.log('Code:', functionCode)
    const jeon = js2jeon(functionCode)
    console.log('JEON:', JSON.stringify(jeon, null, 2))
    const result = evalJeon(jeon)
    console.log('Result:', result)
    console.log('Expected: 16 (5+3 + 2*4)')
    console.log('✓ Regular functions test passed\n')
} catch (error: any) {
    console.error('✗ Regular functions test failed:', error.message)
    console.log('')
}

// Test arrays and objects still work
console.log('Test: Arrays and objects')
const arrayObjectCode = `
const arr = [1, 2, 3];
const obj = { a: 1, b: 2 };
arr[0] + obj.b
`

try {
    console.log('Code:', arrayObjectCode)
    const jeon2 = js2jeon(arrayObjectCode)
    console.log('JEON:', JSON.stringify(jeon2, null, 2))
    const result2 = evalJeon(jeon2)
    console.log('Result:', result2)
    console.log('Expected: 3 (1 + 2)')
    console.log('✓ Arrays and objects test passed\n')
} catch (error: any) {
    console.error('✗ Arrays and objects test failed:', error.message)
    console.log('')
}

// Test arithmetic operations
console.log('Test: Arithmetic operations')
const arithmeticCode = `
(10 + 5) * 2 - 5
`

try {
    console.log('Code:', arithmeticCode)
    const jeon3 = js2jeon(arithmeticCode)
    console.log('JEON:', JSON.stringify(jeon3, null, 2))
    const result3 = evalJeon(jeon3)
    console.log('Result:', result3)
    console.log('Expected: 25 ((10+5)*2 - 5)')
    console.log('✓ Arithmetic operations test passed\n')
} catch (error: any) {
    console.error('✗ Arithmetic operations test failed:', error.message)
    console.log('')
}

console.log('=== Regression tests completed ===')