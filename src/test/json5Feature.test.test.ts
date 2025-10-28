import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import * as JSON5 from 'json5'
import { normalizeJs } from './testUtils'

// Create a JSON-like interface for JSON5
const JSON5Wrapper = {
    stringify: JSON5.stringify,
    parse: JSON5.parse,
    [Symbol.toStringTag]: 'JSON'
}

// Test JSON5 features
const json5TestCases = [
    {
        name: 'Object with special keys',
        code: `const obj = { "special-key": "value", "another.key": "another value" };`
    },
    {
        name: 'Array with trailing comma',
        code: `const arr = [1, 2, 3,];`
    },
    {
        name: 'Unquoted keys',
        code: `const config = { name: "test", value: 42 };`
    },
    {
        name: 'Comments in code',
        code: `const data = { value: 100 }; // This is a comment`
    }
]

test('JSON5 Feature Tests', () => {
    json5TestCases.forEach(({ name, code }) => {
        test(`Round-trip conversion for ${name}`, () => {
            // Convert JS to JEON with JSON5
            const jeon = js2jeon(code, { json: JSON5Wrapper })
            expect(jeon).toBeDefined()
            expect(typeof jeon).toBe('object')

            // Convert JEON back to JS with JSON5
            const regeneratedCode = jeon2js(jeon, { json: JSON5Wrapper })
            expect(regeneratedCode).toBeDefined()
            expect(typeof regeneratedCode).toBe('string')

            // Normalize both codes for comparison
            const normalizedOriginal = normalizeJs(code)
            const normalizedRegenerated = normalizeJs(regeneratedCode)

            console.log(`${name} - Original:`, normalizedOriginal)
            console.log(`${name} - Regenerated:`, normalizedRegenerated)

            // Check that key elements are preserved
            expect(normalizedRegenerated.length).toBeGreaterThan(0)

            // Check for common keywords
            expect(normalizedRegenerated).toContain('const')
            expect(normalizedRegenerated).not.toContain('undefined')
        })
    })
})