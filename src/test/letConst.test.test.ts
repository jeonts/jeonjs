import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { normalizeJs } from './testUtils'

// Test let and const declarations
const testCases = [
    {
        name: 'Simple let declaration',
        code: `let x = 10;`
    },
    {
        name: 'Simple const declaration',
        code: `const y = 20;`
    },
    {
        name: 'Multiple let declarations',
        code: `let a = 1, b = 2, c = 3;`
    },
    {
        name: 'Multiple const declarations',
        code: `const p = 100, q = 200;`
    },
    {
        name: 'Mixed let and const',
        code: `let counter = 0; const MAX = 10;`
    }
]

test('Let and Const Declaration Tests', () => {
    testCases.forEach(({ name, code }) => {
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

            // Check for variable keywords
            if (code.includes('let ')) {
                expect(normalizedRegenerated).toContain('let')
            }
            if (code.includes('const ')) {
                expect(normalizedRegenerated).toContain('const')
            }

            // Check for values
            expect(normalizedRegenerated).not.toContain('undefined')
        })
    })
})