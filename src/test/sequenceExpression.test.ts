// Test for SequenceExpression handling in js2jeon
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'

console.log('=== Testing SequenceExpression Handling ===\n')

// Test case 1: Simple sequence expression
const seqCode1 = '1, 2, 3'
console.log('Test 1: Simple sequence expression')
console.log('JavaScript:', seqCode1)

try {
    const jeon1 = js2jeon(seqCode1)
    console.log('JEON:', JSON.stringify(jeon1, null, 2))

    const back1 = jeon2js(jeon1)
    console.log('Back to JavaScript:', back1)
} catch (error: any) {
    console.log('Error:', error.message)
}
console.log('')

// Test case 2: Function declaration and call sequence (the target case)
const seqCode2 = `(function a(name) { 
  return 'Hello, ' + name; 
}, a('world'))`
console.log('Test 2: Function declaration and call sequence')
console.log('JavaScript:', seqCode2)

try {
    const jeon2 = js2jeon(seqCode2)
    console.log('JEON:', JSON.stringify(jeon2, null, 2))

    const back2 = jeon2js(jeon2)
    console.log('Back to JavaScript:', back2)
} catch (error: any) {
    console.log('Error:', error.message)
}
console.log('')

// Test case 3: More complex sequence
const seqCode3 = 'let x = 1, y = 2, z = x + y'
console.log('Test 3: Variable declarations with sequence')
console.log('JavaScript:', seqCode3)

try {
    const jeon3 = js2jeon(seqCode3)
    console.log('JEON:', JSON.stringify(jeon3, null, 2))

    const back3 = jeon2js(jeon3)
    console.log('Back to JavaScript:', back3)
} catch (error: any) {
    console.log('Error:', error.message)
}
console.log('')

console.log('=== Test Completed ===')