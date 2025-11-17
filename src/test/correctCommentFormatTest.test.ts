import { js2jeon } from '../js2jeon'

// Test function to run tests
function runTest(name: string, testFn: () => void) {
    try {
        testFn()
        console.log(`✅ ${name}`)
    } catch (error) {
        console.log(`❌ ${name}: ${error}`)
    }
}

console.log('=== Correct Comment Format Tests ===')

// Test 1: Block comment (matching your correction)
runTest('Block comment correct format', () => {
    const code = `
/* This is a block comment */
const y = 10;
`
    const jeon = js2jeon(code)
    console.log('JEON with block comment:', JSON.stringify(jeon, null, 2))

    // Verify the structure matches your correction
    const expectedStructure = {
        "//": [" This is a block comment "],
        "@@": {
            "y": 10
        }
    }

    if (!jeon['//'] || !jeon['//'].includes(' This is a block comment ')) {
        throw new Error('Block comment not in correct position')
    }

    if (!jeon['@@'] || jeon['@@'].y !== 10) {
        throw new Error('Variable declaration not in correct position')
    }
})

// Test 2: Multiple comments with statements (matching your correction)
runTest('Multiple comments with statements correct format', () => {
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

    // Verify the structure matches your correction
    if (!Array.isArray(jeon) || jeon.length !== 3) {
        throw new Error('Expected array of 3 statements')
    }

    // Check first statement with comment
    if (!jeon[0]['//'] || !jeon[0]['//'].includes(' First comment')) {
        throw new Error('First comment not associated with first statement')
    }

    if (!jeon[0]['@@'] || jeon[0]['@@'].a !== 1) {
        throw new Error('First variable declaration incorrect')
    }

    // Check second statement with comment
    if (!jeon[1]['//'] || !jeon[1]['//'].includes(' Second comment ')) {
        throw new Error('Second comment not associated with second statement')
    }

    if (!jeon[1]['@@'] || jeon[1]['@@'].b !== 2) {
        throw new Error('Second variable declaration incorrect')
    }

    // Check third statement with comment
    if (!jeon[2]['//'] || !jeon[2]['//'].includes(' Third comment')) {
        throw new Error('Third comment not associated with third statement')
    }

    if (!jeon[2]['@@'] || jeon[2]['@@'].c === undefined) {
        throw new Error('Third variable declaration incorrect')
    }
})

console.log('All correct format tests completed!')