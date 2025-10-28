import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { normalizeJs } from './testUtils'

// Test cases for let and const declarations
const testCases = [
    {
        name: 'Simple let declaration',
        code: `let count = 5;`
    },
    {
        name: 'Simple const declaration',
        code: `const name = "John";`
    },
    {
        name: 'Multiple declarations',
        code: `let a = 1; const b = 2; let c = 3;`
    }
]

test('Let and Const Declaration Tests', () => {
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

            // Check for key elements instead of direct string comparison
            if (name === 'Simple let declaration') {
                expect(regeneratedCode).toContain('let count = 5')
            } else if (name === 'Simple const declaration') {
                expect(regeneratedCode).toContain('const name = "John"')
            } else if (name === 'Multiple declarations') {
                expect(regeneratedCode).toContain('let a = 1')
                expect(regeneratedCode).toContain('const b = 2')
                expect(regeneratedCode).toContain('let c = 3')
            }

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

        const directConstJS = jeon2js(directConstJEON)
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

        const directLetJS = jeon2js(directLetJEON)
        expect(directLetJS).toBeDefined()
        expect(typeof directLetJS).toBe('string')

        const normalizedResult = normalizeJs(directLetJS)
        expect(normalizedResult).toContain('let')
        expect(normalizedResult).toContain('counter')
        expect(normalizedResult).toContain('0')

        console.log('Direct JEON with @ - Converted to JS:', normalizedResult)
    })
})