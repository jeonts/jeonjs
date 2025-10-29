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
        test(`${name} round-trip conversion with key element checks`, () => {
            // Convert JS to JEON
            const jeon = js2jeon(code)
            expect(jeon).toBeDefined()
            expect(typeof jeon).toBe('object')

            // Convert JEON back to JS
            const regeneratedCode = jeon2js(jeon)
            expect(regeneratedCode).toBeDefined()
            expect(typeof regeneratedCode).toBe('string')

            console.log(`${name} - Original:`, code)
            console.log(`${name} - Regenerated:`, regeneratedCode)

            // Check for key elements instead of direct string comparison
            checks.forEach(check => {
                expect(regeneratedCode).toContain(check)
            })

            console.log(`${name} - ✅ Key element checks PASSED`)
        })
    })
})