import { evalJeon } from '../safeEval'

console.log('=== Block Comment Eval Test ===')

// Test 1: Block comment should not affect evaluation
const jeon1 = {
    '/*': 'This is a block comment',
    '@@': {
        'x': 42
    }
}

console.log('Test 1 - JEON with block comment:')
console.log(JSON.stringify(jeon1, null, 2))

try {
    const result1 = evalJeon(jeon1)
    console.log('Evaluation result:', result1)
} catch (error: any) {
    console.log('Error:', error.message)
}

// Test 2: Standalone block comment
const jeon2 = {
    '/*': 'This is a standalone block comment'
}

console.log('\nTest 2 - JEON with standalone block comment:')
console.log(JSON.stringify(jeon2, null, 2))

try {
    const result2 = evalJeon(jeon2)
    console.log('Evaluation result:', result2)
} catch (error: any) {
    console.log('Error:', error.message)
}

console.log('\nAll block comment eval tests completed!')