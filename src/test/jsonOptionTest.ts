import { expect, test } from '@woby/chk'
import { jeon2js } from '../jeon2js'
import JSON5 from 'json5'

// Create a JSON-like interface for JSON5
const JSON5Wrapper = {
    stringify: JSON5.stringify,
    parse: JSON5.parse,
    [Symbol.toStringTag]: 'JSON'
}

test('JSON Option Test', () => {
    test('Converts JEON to JS with different JSON options', () => {
        // Test the new options parameter
        const testJeon = {
            "@": {
                "message": "Hello, World!",
                "count": 42,
                "items": [1, 2, 3]
            }
        }

        console.log('=== Testing with default JSON ===')
        const result1 = jeon2js(testJeon)
        expect(result1).toBeDefined()
        expect(typeof result1).toBe('string')
        console.log(result1)

        console.log('\n=== Testing with JSON5 ===')
        const result2 = jeon2js(testJeon, { json: JSON5Wrapper })
        expect(result2).toBeDefined()
        expect(typeof result2).toBe('string')
        console.log(result2)

        // Basic assertions
        expect(result1.length).toBeGreaterThan(0)
        expect(result2.length).toBeGreaterThan(0)
    })

    test('Complex example with different JSON options', () => {
        // Test with a more complex example
        const complexJeon = {
            "function a(name)": [
                {
                    "return": {
                        "+": [
                            "Hello, ",
                            "@name"
                        ]
                    }
                }
            ]
        }

        console.log('\n=== Complex example with default JSON ===')
        const result3 = jeon2js(complexJeon)
        expect(result3).toBeDefined()
        expect(typeof result3).toBe('string')
        console.log(result3)

        console.log('\n=== Complex example with JSON5 ===')
        const result4 = jeon2js(complexJeon, { json: JSON5Wrapper })
        expect(result4).toBeDefined()
        expect(typeof result4).toBe('string')
        console.log(result4)

        // Basic assertions
        expect(result3.length).toBeGreaterThan(0)
        expect(result4.length).toBeGreaterThan(0)
    })
})