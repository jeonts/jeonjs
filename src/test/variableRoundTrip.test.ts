import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { normalizeJs } from './testUtils'

// Test round-trip conversion for variable declarations
const originalCode = `let count = 0; let message = "Hello World";`

test('Variable Declaration Round-trip Test', () => {
    test('Converts JS to JEON and back', () => {
        // Convert JS to JEON
        const jeon = js2jeon(originalCode)
        expect(jeon).toBeDefined()
        expect(typeof jeon).toBe('object')

        // Convert JEON back to JS
        const regeneratedCode = jeon2js(jeon)
        expect(regeneratedCode).toBeDefined()
        expect(typeof regeneratedCode).toBe('string')

        // Normalize both codes for comparison
        const normalizedOriginal = normalizeJs(originalCode)
        const normalizedRegenerated = normalizeJs(regeneratedCode)

        console.log('Variable declarations - Original:', normalizedOriginal)
        console.log('Variable declarations - Regenerated:', normalizedRegenerated)

        // Check if they're equivalent
        expect(normalizedRegenerated).toContain('count')
        expect(normalizedRegenerated).toContain('message')
        expect(normalizedRegenerated).toContain('0')
        expect(normalizedRegenerated).toContain('"Hello World"')

        // Verify the structure
        expect(normalizedRegenerated).toContain('let count = 0')
        expect(normalizedRegenerated).toContain('let message = "Hello World"')
    })
})