import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { normalizeJs } from './testUtils'

// Test different function types
const testCases = [
    {
        name: 'Named function',
        code: `function a(name) { return ("Hello, " + name) }`,
        checks: ['function', 'a', 'name', 'return', 'Hello']
    },
    {
        name: 'Arrow function',
        code: `(x) => { return (x * 2); }`,
        checks: ['=>', 'x', 'return', '*']
    },
    {
        name: 'Anonymous function expression',
        code: `(function(name) { return ("Hello, " + name) })`,
        checks: ['function', 'name', 'return', 'Hello']
    }
]

test('Function Round-trip Tests', () => {
    testCases.forEach(({ name, code, checks }) => {
        test(`${name} round-trip conversion`, () => {
            // Convert JS to JEON
            const jeon = js2jeon(code)
            expect(jeon).toBeDefined()
            expect(typeof jeon).toBe('object')

            // Convert JEON back to JS
            const regeneratedCode = jeon2js(jeon)
            expect(regeneratedCode).toBeDefined()
            expect(typeof regeneratedCode).toBe('string')

            // Normalize both codes for comparison
            const normalizedOriginal = normalizeJs(code)
            const normalizedRegenerated = normalizeJs(regeneratedCode)

            console.log(`${name} - Original:`, normalizedOriginal)
            console.log(`${name} - Regenerated:`, normalizedRegenerated)

            // Check that key elements are preserved
            checks.forEach(check => {
                expect(normalizedRegenerated).toContain(check)
            })

            // Check that the result is not empty
            expect(normalizedRegenerated.length).toBeGreaterThan(0)
        })
    })
})