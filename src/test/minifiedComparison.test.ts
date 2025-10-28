import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { normalizeJs } from './testUtils'

// Test cases
const testCases = [
    {
        name: 'Simple variable declarations',
        code: `let count = 0; let message = "Hello World";`
    },
    {
        name: 'Function declaration',
        code: `function add(a, b) { return a + b; }`
    },
    {
        name: 'Arrow function',
        code: `const multiply = (x, y) => x * y;`
    },
    {
        name: 'Class declaration',
        code: `class Person { constructor(name) { this.name = name; } greet() { return "Hello, " + this.name; } }`
    },
    {
        name: 'Variable with const',
        code: `const PI = 3.14159; let radius = 5;`
    }
]

test('Minified Code Comparison Tests', () => {
    testCases.forEach(({ name, code }) => {
        test(`Round-trip conversion for ${name} with direct normalized string comparison`, () => {
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

            // Log for debugging
            console.log(`Original (${name}):`, normalizedOriginal)
            console.log(`Regenerated (${name}):`, normalizedRegenerated)

            // Direct normalized string comparison
            expect(normalizedRegenerated).toBe(normalizedOriginal)

            console.log(`✅ ${name} - Direct normalized string comparison PASSED`)
        })
    })
})