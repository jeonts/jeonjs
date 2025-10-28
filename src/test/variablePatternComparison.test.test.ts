import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { normalizeJs } from './testUtils'

test('Variable Declaration Pattern Comparison', () => {
    test('Separate variable declarations', () => {
        const code = `let a = 1; let b = 2; const C = 3; const d = 5;`
        const jeon = js2jeon(code)
        const regeneratedCode = jeon2js(jeon)

        const normalizedOriginal = normalizeJs(code)
        const normalizedRegenerated = normalizeJs(regeneratedCode)

        console.log('Separate declarations - Original:', normalizedOriginal)
        console.log('Separate declarations - Regenerated:', normalizedRegenerated)

        // Check that the regenerated code has the expected structure
        expect(normalizedRegenerated).toContain('let a = 1')
        expect(normalizedRegenerated).toContain('let b = 2')
        expect(normalizedRegenerated).toContain('const C = 3')
        expect(normalizedRegenerated).toContain('const d = 5')

        // The regenerated code should have the same number of statements
        const originalStatements = normalizedOriginal.split(';').filter(s => s.trim().length > 0)
        const regeneratedStatements = normalizedRegenerated.split(';').filter(s => s.trim().length > 0)
        expect(regeneratedStatements.length).toBe(originalStatements.length)
    })

    test('Combined variable declarations', () => {
        const code = `let a = 1, b = 2; const C = 3, d = 5;`
        const jeon = js2jeon(code)
        const regeneratedCode = jeon2js(jeon)

        const normalizedOriginal = normalizeJs(code)
        const normalizedRegenerated = normalizeJs(regeneratedCode)

        console.log('Combined declarations - Original:', normalizedOriginal)
        console.log('Combined declarations - Regenerated:', normalizedRegenerated)

        // Check that the regenerated code has the expected structure
        expect(normalizedRegenerated).toContain('let a = 1')
        expect(normalizedRegenerated).toContain('let b = 2')
        expect(normalizedRegenerated).toContain('const C = 3')
        expect(normalizedRegenerated).toContain('const d = 5')

        // Note: Combined declarations are split into separate statements
        // Original: 2 statements (let a=1,b=2; const C=3,d=5;)
        // Regenerated: 4 statements (let a=1; let b=2; const C=3; const d=5;)
        const regeneratedStatements = normalizedRegenerated.split(';').filter(s => s.trim().length > 0)
        expect(regeneratedStatements.length).toBe(4)
    })

    test('Mixed variable declarations', () => {
        const code = `let x = 1; let y = 2, z = 3; const A = 4; const B = 5, C = 6;`
        const jeon = js2jeon(code)
        const regeneratedCode = jeon2js(jeon)

        const normalizedOriginal = normalizeJs(code)
        const normalizedRegenerated = normalizeJs(regeneratedCode)

        console.log('Mixed declarations - Original:', normalizedOriginal)
        console.log('Mixed declarations - Regenerated:', normalizedRegenerated)

        // Check that all variables are present
        expect(normalizedRegenerated).toContain('let x = 1')
        expect(normalizedRegenerated).toContain('let y = 2')
        expect(normalizedRegenerated).toContain('let z = 3')
        expect(normalizedRegenerated).toContain('const A = 4')
        expect(normalizedRegenerated).toContain('const B = 5')
        expect(normalizedRegenerated).toContain('const C = 6')

        // All combined declarations should be split
        const regeneratedStatements = normalizedRegenerated.split(';').filter(s => s.trim().length > 0)
        expect(regeneratedStatements.length).toBe(6)
    })
})