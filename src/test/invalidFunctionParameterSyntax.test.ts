import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'

// Test different function parameter syntax cases
const functionParameterTests = [
    {
        name: 'Invalid function parameter syntax with missing comma',
        jeon: {
            "function(a, b d)": [
                { "return": { "+": ["@a", "@b"] } }
            ]
        },
        shouldThrow: true,
        errorMessage: 'Invalid parameter name'
    },
    {
        name: 'Valid function parameter syntax',
        jeon: {
            "function(a, b)": [
                { "return": { "+": ["@a", "@b"] } }
            ]
        },
        shouldThrow: false,
        expectedElements: ['function(a, b)', 'return (a + b)']
    },
    {
        name: 'Function with no parameters',
        jeon: {
            "function()": [
                { "return": 42 }
            ]
        },
        shouldThrow: false,
        expectedElements: ['function()', 'return 42']
    },
    {
        name: 'Function with single parameter',
        jeon: {
            "function(x)": [
                { "return": { "*": ["@x", 2] } }
            ]
        },
        shouldThrow: false,
        expectedElements: ['function(x)', 'return (x * 2)']
    }
]

test('Function Parameter Syntax Tests', () => {
    functionParameterTests.forEach(({ name, jeon, shouldThrow, errorMessage, expectedElements }) => {
        test(name, () => {
            if (shouldThrow) {
                expect(() => {
                    jeon2js(jeon)
                }).toThrow(errorMessage ? new RegExp(errorMessage) : undefined)
            } else {
                const result = jeon2js(jeon)
                expect(result).toBeDefined()
                expect(typeof result).toBe('string')

                console.log(`${name} - Generated JS:`, result)

                // Check that expected elements are present
                if (expectedElements) {
                    expectedElements.forEach(element => {
                        expect(result).toContain(element)
                    })
                }
            }
        })
    })
})