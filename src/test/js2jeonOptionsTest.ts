import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import JSON5 from 'json5'

// Create a JSON-like interface for JSON5
const JSON5Wrapper = {
    stringify: JSON5.stringify,
    parse: JSON5.parse,
    [Symbol.toStringTag]: 'JSON'
}

// Test the new options parameter
const testCode = `
function greet(name) {
  return "Hello, " + name;
}

const obj = {
  "special-key": "value",
  "another.key": "another value"
};
`

test('js2jeon Options Test', () => {
    test('Converts JS to JEON with different JSON options', () => {
        console.log('=== Testing with default JSON ===')
        const result1 = js2jeon(testCode)
        expect(result1).toBeDefined()
        expect(typeof result1).toBe('object')
        console.log(JSON.stringify(result1, null, 2))

        console.log('\n=== Testing with JSON5 ===')
        const result2 = js2jeon(testCode, { json: JSON5Wrapper })
        expect(result2).toBeDefined()
        expect(typeof result2).toBe('object')
        console.log(JSON.stringify(result2, null, 2))

        // Basic assertions
        expect(result1).not.toBeNull()
        expect(result2).not.toBeNull()
    })
})