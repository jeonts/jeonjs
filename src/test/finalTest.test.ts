import { expect, test } from '@woby/chk'
import { jeon2js } from '../jeon2js'
import JSON5 from 'json5'

// Create a JSON-like interface for JSON5
const JSON5Wrapper = {
    stringify: JSON5.stringify,
    parse: JSON5.parse,
    [Symbol.toStringTag]: 'JSON'
}

// Test various JEON structures with both JSON and JSON5
const testCases = [
    // Simple object
    {
        "@": {
            "name": "John",
            "age": 30
        }
    },

    // Function declaration
    {
        "function greet(name)": [
            {
                "return": {
                    "+": [
                        "Hello, ",
                        "@name"
                    ]
                }
            }
        ]
    },

    // Arrow function
    {
        "(x) =>": {
            "*": ["@x", 2]
        }
    },

    // Class declaration
    {
        "class Person": {
            "constructor(name)": {
                "function(name)": [
                    {
                        "=": [
                            { ".": ["@this", "name"] },
                            "@name"
                        ]
                    }
                ]
            }
        }
    }
]

test('Final Test', () => {
    test('Converts JEON to JS with default JSON', () => {
        console.log('=== Testing with default JSON ===')
        testCases.forEach((testCase, index) => {
            console.log(`\nTest case ${index + 1}:`)
            try {
                const result = jeon2js(testCase)
                expect(result).toBeDefined()
                expect(typeof result).toBe('string')
                console.log(result)
            } catch (error: any) {
                console.log(`Error: ${error.message}`)
                expect(error).toBeUndefined() // This will fail and show the error
            }
        })
    })

    test('Converts JEON to JS with JSON5', () => {
        console.log('\n\n=== Testing with JSON5 ===')
        testCases.forEach((testCase, index) => {
            console.log(`\nTest case ${index + 1}:`)
            try {
                const result = jeon2js(testCase, { json: JSON5Wrapper })
                expect(result).toBeDefined()
                expect(typeof result).toBe('string')
                console.log(result)
            } catch (error: any) {
                console.log(`Error: ${error.message}`)
                expect(error).toBeUndefined() // This will fail and show the error
            }
        })
    })
})