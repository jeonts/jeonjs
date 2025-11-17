import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { evalJeon } from '../safeEval'

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
    if (!jeon['//'] || !jeon['//'].includes(' This is a line comment')) {
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
    if (!jeon['//'] || !jeon['//'].includes(' This is a block comment ')) {
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
    if (!Array.isArray(jeon) || jeon.length !== 3) {
        throw new Error('Expected 3 statements in JEON output')
    }

    // Check first statement
    if (!jeon[0]['//'] || !jeon[0]['//'].includes(' First comment')) {
        throw new Error('First comment not found with first statement')
    }

    // Check second statement
    if (!jeon[1]['//'] || !jeon[1]['//'].includes(' Second comment ')) {
        throw new Error('Second comment not found with second statement')
    }

    // Check third statement
    if (!jeon[2]['//'] || !jeon[2]['//'].includes(' Third comment')) {
        throw new Error('Third comment not found with third statement')
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
    if (!jeon['//'] || jeon['//'].length !== 2) {
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

    // The regenerated code should be valid JEON that includes the comment structure
    // Let's parse it back to verify it has the comment
    try {
        // This is a bit tricky because we're getting the JEON representation as a string
        // In a real scenario, you would use the JEON directly rather than converting to string
        const parsed = JSON.parse(regeneratedCode.replace(/'/g, '"').replace(/@/g, '"@').replace(/@"/g, '"'))
        if (!parsed['//'] || !parsed['//'].includes(' This is a comment')) {
            throw new Error('Comment not preserved in round-trip conversion')
        }
    } catch (e) {
        // For now, we'll just check that the string contains the comment
        if (!regeneratedCode.includes(' This is a comment')) {
            throw new Error('Comment not preserved in round-trip conversion')
        }
    }
})

// Test 6: Evaluation test
runTest('Evaluate JEON with comments', () => {
    const jeon = {
        "@@": {
            "x": 42
        },
        "//": [
            " This is a comment"
        ]
    }

    // Evaluate the JEON
    const result = evalJeon(jeon)
    console.log('Evaluation result:', result)

    // The result should be an object with x = 42 and the comment preserved
    // Note: evalJeon preserves the structure, so we expect the comment to be in the result
    if (!result || result['@@'].x !== 42) {
        throw new Error('Evaluation did not produce expected result')
    }

    // The comment should also be preserved in the result
    if (!result['//'] || !result['//'].includes(' This is a comment')) {
        throw new Error('Comment not preserved in evaluation')
    }
})

console.log('All comprehensive tests completed!')