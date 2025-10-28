import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { normalizeJs } from './testUtils'

// Test different function types
const namedFunctionCode = `function a(name) { return ("Hello, " + name) }`
const arrowFunctionCode = `(x) => { return (x * 2); }`
const anonymousFunctionCode = `(function(name) { return ("Hello, " + name) })`

test('Function Round-trip Tests', () => {
    test('Named function round-trip conversion', () => {
        const namedJeon = js2jeon(namedFunctionCode)
        expect(namedJeon).toBeDefined()
        expect(typeof namedJeon).toBe('object')

        const regeneratedNamedCode = jeon2js(namedJeon)
        expect(regeneratedNamedCode).toBeDefined()
        expect(typeof regeneratedNamedCode).toBe('string')

        // Normalize both codes for comparison
        const normalizedOriginal = normalizeJs(namedFunctionCode)
        const normalizedRegenerated = normalizeJs(regeneratedNamedCode)

        console.log('Named function - Original:', normalizedOriginal)
        console.log('Named function - Regenerated:', normalizedRegenerated)

        // Basic check that the regenerated code contains expected elements
        expect(normalizedRegenerated).toContain('function')
        expect(normalizedRegenerated).toContain('a')
        expect(normalizedRegenerated).toContain('name')
        expect(normalizedRegenerated).toContain('return')
    })

    test('Arrow function round-trip conversion', () => {
        const arrowJeon = js2jeon(arrowFunctionCode)
        expect(arrowJeon).toBeDefined()
        expect(typeof arrowJeon).toBe('object')

        const regeneratedArrowCode = jeon2js(arrowJeon)
        expect(regeneratedArrowCode).toBeDefined()
        expect(typeof regeneratedArrowCode).toBe('string')

        // Normalize both codes for comparison
        const normalizedOriginal = normalizeJs(arrowFunctionCode)
        const normalizedRegenerated = normalizeJs(regeneratedArrowCode)

        console.log('Arrow function - Original:', normalizedOriginal)
        console.log('Arrow function - Regenerated:', normalizedRegenerated)

        // Basic check that the regenerated code contains expected elements
        expect(normalizedRegenerated).toContain('=>')
        expect(normalizedRegenerated).toContain('x')
        expect(normalizedRegenerated).toContain('return')
        expect(normalizedRegenerated).toContain('*')
    })

    test('Anonymous function expression round-trip conversion', () => {
        const anonymousJeon = js2jeon(anonymousFunctionCode)
        expect(anonymousJeon).toBeDefined()
        expect(typeof anonymousJeon).toBe('object')

        const regeneratedAnonymousCode = jeon2js(anonymousJeon)
        expect(regeneratedAnonymousCode).toBeDefined()
        expect(typeof regeneratedAnonymousCode).toBe('string')

        // Normalize both codes for comparison
        const normalizedOriginal = normalizeJs(anonymousFunctionCode)
        const normalizedRegenerated = normalizeJs(regeneratedAnonymousCode)

        console.log('Anonymous function - Original:', normalizedOriginal)
        console.log('Anonymous function - Regenerated:', normalizedRegenerated)

        // Basic check that the regenerated code contains expected elements
        expect(normalizedRegenerated).toContain('function')
        expect(normalizedRegenerated).toContain('name')
        expect(normalizedRegenerated).toContain('return')
        expect(normalizedRegenerated).toContain('Hello')
    })
})