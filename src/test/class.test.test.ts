import { test, expect } from '@woby/chk'
import { js2jeon, jeon2js } from '../index'
import { normalizeJs } from './testUtils'

const classCode = `class Person {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return "Hello, " + this.name;
  }
}`

test('Class Conversion Tests', () => {
    test('Converts class from JS to JEON', () => {
        const jeon = js2jeon(classCode)
        expect(jeon).toBeDefined()
        expect(typeof jeon).toBe('object')

        // Check that JEON structure contains expected elements
        expect(JSON.stringify(jeon)).toContain('class Person')
        expect(JSON.stringify(jeon)).toContain('constructor')
        expect(JSON.stringify(jeon)).toContain('greet')
    })

    test('Converts class from JEON back to JS', () => {
        const jeon = js2jeon(classCode)
        const regeneratedCode = jeon2js(jeon)
        expect(regeneratedCode).toBeDefined()
        expect(typeof regeneratedCode).toBe('string')

        // Normalize both codes for comparison
        const normalizedOriginal = normalizeJs(classCode)
        const normalizedRegenerated = normalizeJs(regeneratedCode)

        console.log('Class - Original:', normalizedOriginal)
        console.log('Class - Regenerated:', normalizedRegenerated)

        // Check that regenerated code contains expected elements
        expect(normalizedRegenerated).toContain('class Person')
        expect(normalizedRegenerated).toContain('constructor')
        expect(normalizedRegenerated).toContain('greet')
        expect(normalizedRegenerated).toContain('this.name')
        expect(normalizedRegenerated).toContain('Hello')
    })

    test('Round-trip conversion preserves class structure', () => {
        const jeon = js2jeon(classCode)
        const regeneratedCode = jeon2js(jeon)

        // Normalize both codes for comparison
        const normalizedOriginal = normalizeJs(classCode)
        const normalizedRegenerated = normalizeJs(regeneratedCode)

        // Verify key structural elements are preserved
        expect(normalizedRegenerated).toContain('class Person')
        expect(normalizedRegenerated).toContain('constructor(name)')
        expect(normalizedRegenerated).toContain('greet()')
        expect(normalizedRegenerated).toContain('this.name = name')
        expect(normalizedRegenerated).toContain('return')
        expect(normalizedRegenerated).toContain('Hello')
    })
})