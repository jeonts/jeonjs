import { expect, test } from '@woby/chk'
import { jeon2js } from '../jeon2js'

test('Function Parameter Validation Test', () => {
    test('Invalid function parameter syntax should throw error', () => {
        const invalidJeon = {
            "function(a, b d)": [
                { "return": { "+": ["@a", "@b"] } }
            ]
        }

        expect(() => {
            jeon2js(invalidJeon)
        }).toThrow(/Invalid parameter name/)
    })

    test('Valid function parameter syntax should work correctly', () => {
        const validJeon = {
            "function(a, b)": [
                { "return": { "+": ["@a", "@b"] } }
            ]
        }

        const result = jeon2js(validJeon)
        expect(result).toContain('function(a, b)')
        expect(result).toContain('return (a + b)')
    })

    test('Function with no parameters should work correctly', () => {
        const noParamJeon = {
            "function()": [
                { "return": 42 }
            ]
        }

        const result = jeon2js(noParamJeon)
        expect(result).toContain('function()')
        expect(result).toContain('return 42')
    })

    test('Function with single parameter should work correctly', () => {
        const singleParamJeon = {
            "function(x)": [
                { "return": { "*": ["@x", 2] } }
            ]
        }

        const result = jeon2js(singleParamJeon)
        expect(result).toContain('function(x)')
        expect(result).toContain('return (x * 2)')
    })
})