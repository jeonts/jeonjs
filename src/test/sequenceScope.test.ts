// Test for SequenceExpression scope handling
import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Testing SequenceExpression Scope Handling ===\n')

// Test case 1: Simple sequence with literals
const seq1 = '1, 2, 3'
console.log('Test 1: Simple sequence')
console.log('JavaScript:', seq1)

try {
    const jeon1 = js2jeon(seq1)
    console.log('JEON:', JSON.stringify(jeon1, null, 2))
    const result1 = evalJeon(jeon1)
    console.log('Result:', result1)
} catch (error: any) {
    console.log('Error:', error.message)
}
console.log('')

// Test case 2: Sequence with variable declaration and usage
const seq2 = 'let x = 5, y = x * 2'
console.log('Test 2: Variable declaration sequence')
console.log('JavaScript:', seq2)

try {
    const jeon2 = js2jeon(seq2)
    console.log('JEON:', JSON.stringify(jeon2, null, 2))
    const result2 = evalJeon(jeon2)
    console.log('Result:', result2)
} catch (error: any) {
    console.log('Error:', error.message)
}
console.log('')

// Test case 3: Function declaration and call in sequence (simplified)
const seq3 = '(function() { return "hello"; }, "world")'
console.log('Test 3: Function expression and value')
console.log('JavaScript:', seq3)

try {
    const jeon3 = js2jeon(seq3)
    console.log('JEON:', JSON.stringify(jeon3, null, 2))
    const result3 = evalJeon(jeon3)
    console.log('Result:', result3)
} catch (error: any) {
    console.log('Error:', error.message)
}
console.log('')

console.log('=== Test Completed ===')