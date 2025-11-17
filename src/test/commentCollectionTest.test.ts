import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'

// Simple test function to mimic the testing framework
function runTest(name: string, testFn: () => void) {
    try {
        testFn()
        console.log(`✅ ${name}`)
    } catch (error) {
        console.log(`❌ ${name}: ${error}`)
    }
}

console.log('=== Comment Collection and Injection Tests ===')

runTest('Convert JavaScript with line comments to JEON', () => {
    const code = `
// This is a line comment
const x = 42;
`
    const jeon = js2jeon(code)
    console.log('JEON with comments:', JSON.stringify(jeon, null, 2))

    // Check that the result is defined
    if (!jeon) {
        throw new Error('Expected JEON result to be defined')
    }
})

runTest('Convert JavaScript with block comments to JEON', () => {
    const code = `
/* This is a block comment */
const y = 10;
`
    const jeon = js2jeon(code)
    console.log('JEON with comments:', JSON.stringify(jeon, null, 2))

    // Check that the result is defined
    if (!jeon) {
        throw new Error('Expected JEON result to be defined')
    }
})

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
    console.log('JEON with comments:', JSON.stringify(jeon, null, 2))

    // Check that the result is defined
    if (!jeon) {
        throw new Error('Expected JEON result to be defined')
    }
})

console.log('All tests completed!')