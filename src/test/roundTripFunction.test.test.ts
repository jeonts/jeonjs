import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'

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

        // Basic check that the regenerated code contains expected elements
        expect(regeneratedNamedCode).toContain('function')
        expect(regeneratedNamedCode).toContain('a')
        expect(regeneratedNamedCode).toContain('name')
        expect(regeneratedNamedCode).toContain('return')
    })

    test('Arrow function round-trip conversion', () => {
        const arrowJeon = js2jeon(arrowFunctionCode)
        expect(arrowJeon).toBeDefined()
        expect(typeof arrowJeon).toBe('object')

        const regeneratedArrowCode = jeon2js(arrowJeon)
        expect(regeneratedArrowCode).toBeDefined()
        expect(typeof regeneratedArrowCode).toBe('string')

        // Basic check that the regenerated code contains expected elements
        expect(regeneratedArrowCode).toContain('=>')
        expect(regeneratedArrowCode).toContain('x')
        expect(regeneratedArrowCode).toContain('return')
        expect(regeneratedArrowCode).toContain('*')
    })

    test('Anonymous function expression round-trip conversion', () => {
        const anonymousJeon = js2jeon(anonymousFunctionCode)
        expect(anonymousJeon).toBeDefined()
        expect(typeof anonymousJeon).toBe('object')

        const regeneratedAnonymousCode = jeon2js(anonymousJeon)
        expect(regeneratedAnonymousCode).toBeDefined()
        expect(typeof regeneratedAnonymousCode).toBe('string')

        // Basic check that the regenerated code contains expected elements
        expect(regeneratedAnonymousCode).toContain('function')
        expect(regeneratedAnonymousCode).toContain('name')
        expect(regeneratedAnonymousCode).toContain('return')
        expect(regeneratedAnonymousCode).toContain('Hello')
    })
})