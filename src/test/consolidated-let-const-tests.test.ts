// Consolidated Let/Const Tests
// This file consolidates similar let and const test cases from letConstTest.test.ts
import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { normalizeJs } from './testUtils'

// Test cases for let and const declarations
const letConstTestCases = [
    {
        name: 'Simple let declaration',
        code: `let count = 5;`,
        expectedElements: ['let count = 5']
    },
    {
        name: 'Simple const declaration',
        code: `const name = "John";`,
        expectedElements: ['const name = "John"']
    },
    {
        name: 'Multiple declarations',
        code: `let a = 1; const b = 2; let c = 3;`,
        expectedElements: ['let a = 1', 'const b = 2', 'let c = 3']
    }
]

test('Let and Const Declaration Tests', () => {
    letConstTestCases.forEach(({ name, code, expectedElements }) => {
        test(`Round-trip conversion for ${name}`, () => {
            // Convert JS to JEON
            const jeon = js2jeon(code)
            expect(jeon).toBeDefined()
            expect(typeof jeon).toBe('object')

            // Convert JEON back to JS
            const regeneratedCode = jeon2js(jeon)
            expect(regeneratedCode).toBeDefined()
            expect(typeof regeneratedCode).toBe('string')

            // Check for expected elements
            expectedElements.forEach(element => {
                expect(regeneratedCode).toContain(element)
            })

            console.log(`${name} - ✅ Key element checks PASSED`)
        })
    })

    // Test direct JEON with @@ for const
    test('Direct JEON with @@ for const', () => {
        const directConstJEON = {
            "@@": {
                "PI": 3.14159
            }
        }

        // Cast to any to avoid type issues
        const directConstJS = jeon2js(directConstJEON as any)
        expect(directConstJS).toBeDefined()
        expect(typeof directConstJS).toBe('string')

        const normalizedResult = normalizeJs(directConstJS)
        expect(normalizedResult).toContain('const')
        expect(normalizedResult).toContain('PI')
        expect(normalizedResult).toContain('3.14159')

        console.log('Direct JEON with @@ - Converted to JS:', normalizedResult)
    })

    // Test direct JEON with @ for let
    test('Direct JEON with @ for let', () => {
        const directLetJEON = {
            "@": {
                "counter": 0
            }
        }

        // Cast to any to avoid type issues
        const directLetJS = jeon2js(directLetJEON as any)
        expect(directLetJS).toBeDefined()
        expect(typeof directLetJS).toBe('string')

        const normalizedResult = normalizeJs(directLetJS)
        expect(normalizedResult).toContain('let')
        expect(normalizedResult).toContain('counter')
        expect(normalizedResult).toContain('0')

        console.log('Direct JEON with @ - Converted to JS:', normalizedResult)
    })
})

console.log('🎉 All consolidated let/const tests completed!')