import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { normalizeJs } from './testUtils'

test('Variable Declaration Round-trip Test', () => {
    test('Converts JS to JEON and back', () => {
        const originalCode = `let count = 0; let message = "Hello World";`

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

        console.log('Original code:', normalizedOriginal)
        console.log('Regenerated code:', normalizedRegenerated)

        // Check that key elements are preserved
        expect(normalizedRegenerated).toContain('count')
        expect(normalizedRegenerated).toContain('message')
        expect(normalizedRegenerated).toContain('0')
        expect(normalizedRegenerated).toContain('"Hello World"')

        // Check for variable keywords
        expect(normalizedRegenerated).toContain('let count = 0')
        expect(normalizedRegenerated).toContain('let message = "Hello World"')

        // Check that the result is not empty
        expect(normalizedRegenerated.length).toBeGreaterThan(0)
    })
})