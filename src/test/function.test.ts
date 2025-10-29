import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { normalizeJs } from './testUtils'

// Test different function types
const functionTests = [
    {
        name: 'Simple function declaration',
        code: `function add(a, b) { return a + b; }`
    },
    {
        name: 'Function with no parameters',
        code: `function greet() { return "Hello"; }`
    },
    {
        name: 'Function with multiple statements',
        code: `function calculate(x, y) { const sum = x + y; const product = x * y; return sum + product; }`
    }
]

test('Function Conversion Tests', () => {
    functionTests.forEach(({ name, code }) => {
        test(`Round-trip conversion for ${name}`, () => {
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
            expect(normalizedRegenerated.length).toBeGreaterThan(0)

            // Check that function keyword is preserved
            expect(normalizedRegenerated).toContain('function')

            // Check that return statement is preserved
            expect(normalizedRegenerated).toContain('return')
        })
    })
})