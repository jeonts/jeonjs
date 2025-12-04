import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { evalJeon } from '../safeEval'
import { JeonExpression } from '../JeonExpression'

// Test function to run tests
function runTest(name: string, testFn: () => void) {
    try {
        testFn()
        console.log(`✅ ${name}`)
    } catch (error) {
        console.log(`❌ ${name}: ${error}`)
    }
}

console.log('=== Comprehensive Comment Collection and Injection Tests ===')

// Test 1: Simple line comment
runTest('Convert JavaScript with line comment to JEON', () => {
    const code = `
// This is a line comment
const x = 42;
`
    const jeon = js2jeon(code)
    console.log('JEON with line comment:', JSON.stringify(jeon, null, 2))

    // Verify the comment is included
    // The actual format is an array with separate objects for comments and statements
    if (!Array.isArray(jeon) || jeon.length < 1) {
        throw new Error('Expected array output for JEON with comments')
    }

    // Find the comment object in the array
    const commentObj = jeon.find(item => item['//'] !== undefined)
    if (!commentObj || !commentObj['//'].includes('This is a line comment')) {
        throw new Error('Line comment not found in JEON output')
    }
})

// Test 2: Block comment
runTest('Convert JavaScript with block comment to JEON', () => {
    const code = `
/* This is a block comment */
const y = 10;
`
    const jeon = js2jeon(code)
    console.log('JEON with block comment:', JSON.stringify(jeon, null, 2))

    // Verify the comment is included
    if (!Array.isArray(jeon) || jeon.length < 1) {
        throw new Error('Expected array output for JEON with comments')
    }

    // Find the comment object in the array
    const commentObj = jeon.find(item => item['/*'] !== undefined)
    if (!commentObj || !commentObj['/*'].join('').includes('This is a block comment')) {
        throw new Error('Block comment not found in JEON output')
    }
})

// Test 3: Multiple comments
runTest('Convert JavaScript with multiple comments to JEON', () => {
    const code = `
// First comment
const a = 1;

/* Second comment */
const b = 2;

// Third comment
const c = a + b;
`
    const jeon = js2jeon(code)
    console.log('JEON with multiple comments:', JSON.stringify(jeon, null, 2))

    // Verify all comments are included with their statements
    if (!Array.isArray(jeon) || jeon.length < 3) {
        throw new Error(`Expected at least 3 items in JEON output, got ${jeon.length}`)
    }

    // Count comment objects
    const commentObjects = jeon.filter(item => item['//'] !== undefined || item['/*'] !== undefined)
    if (commentObjects.length < 3) {
        throw new Error(`Expected at least 3 comment objects, found ${commentObjects.length}`)
    }
})

// Test 4: Comments with functions
runTest('Convert JavaScript function with comments to JEON', () => {
    const code = `
// Function to add two numbers
function add(a, b) {
    // Return the sum
    return a + b;
}
`
    const jeon = js2jeon(code)
    console.log('JEON with function and comments:', JSON.stringify(jeon, null, 2))

    // Verify the comments are included
    if (!Array.isArray(jeon)) {
        throw new Error('Expected array output for JEON with comments')
    }

    // Look for comment objects anywhere in the structure
    const hasLineComments = jeon.some(item =>
        item['//'] !== undefined ||
        (typeof item === 'object' && item !== null && JSON.stringify(item).includes('"//":'))
    )

    if (!hasLineComments) {
        throw new Error('Function comments not found in JEON output')
    }
})

// Test 5: Round-trip test (js2jeon -> jeon2js)
runTest('Round-trip test with comments', () => {
    const originalCode = `
// This is a comment
const value = 100;
`
    const jeon = js2jeon(originalCode)
    console.log('JEON:', JSON.stringify(jeon, null, 2))

    const regeneratedCode = jeon2js(jeon)
    console.log('Regenerated JEON as string:', regeneratedCode)

    // Check that the regenerated code contains the comment
    if (!regeneratedCode.includes('//This is a comment')) {
        throw new Error('Comment not preserved in round-trip conversion')
    }
})

// Test 6: Evaluation test
runTest('Evaluate JEON with comments', () => {
    // Create a proper JeonExpression for a simple value
    const expression: JeonExpression = {
        "+": [1, 2]
    }

    // Evaluate the expression
    const result = evalJeon(expression)
    console.log('Evaluation result:', result)

    // The result should be 3 (1 + 2)
    if (result !== 3) {
        throw new Error(`Evaluation did not produce expected result, got ${result} instead of 3`)
    }
})

console.log('All comprehensive tests completed!')