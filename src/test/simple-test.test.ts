// Simple test runner for JEON project
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'

// Simple test function
function expect(actual: any) {
    return {
        toBe(expected: any) {
            if (actual !== expected) {
                throw new Error(`Expected ${expected} but got ${actual}`)
            }
            console.log('✅ Test passed')
        },
        toEqual(expected: any) {
            if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`)
            }
            console.log('✅ Test passed')
        }
    }
}

// Test 1: Simple function conversion
console.log('=== Test 1: Simple function conversion ===')
const code1 = `function add(a, b) { return a + b; }`
const jeon1 = js2jeon(code1)
const js1 = jeon2js(jeon1)
console.log('Original:', code1)
console.log('JEON:', JSON.stringify(jeon1, null, 2))
console.log('Back to JS:', js1)
expect(typeof jeon1).toBe('object')
expect(typeof js1).toBe('string')

// Test 2: Variable declaration conversion
console.log('\n=== Test 2: Variable declaration conversion ===')
const code2 = `let count = 0; let message = "Hello World";`
const jeon2 = js2jeon(code2)
const js2 = jeon2js(jeon2)
console.log('Original:', code2)
console.log('JEON:', JSON.stringify(jeon2, null, 2))
console.log('Back to JS:', js2)
expect(typeof jeon2).toBe('object')
expect(typeof js2).toBe('string')

console.log('\n🎉 All tests completed successfully!')