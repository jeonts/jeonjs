import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { normalizeJs } from './testUtils'

// Test cases where we expect high similarity after round-trip conversion
const exactMatchCases = [
    {
        name: 'Simple const declaration',
        code: `const PI = 3.14159;`
    },
    {
        name: 'Simple let declaration',
        code: `let count = 0;`
    },
    {
        name: 'Multiple const declarations',
        code: `const a = 1, b = 2;`
    },
    {
        name: 'Multiple let declarations',
        code: `let x = 1, y = 2;`
    }
]

// Test cases where we expect structural similarity but not exact match
const structuralMatchCases = [
    {
        name: 'Function with single return',
        code: `function getZero() { return 0; }`
    },
    {
        name: 'Arrow function',
        code: `const id = (x) => x;`
    }
]

test('Direct Code Comparison Tests', () => {
    test('Exact match cases with direct normalized string comparison', () => {
        exactMatchCases.forEach(({ name, code }) => {
            const jeon = js2jeon(code)
            const regeneratedCode = jeon2js(jeon)

            const normalizedOriginal = normalizeJs(code)
            const normalizedRegenerated = normalizeJs(regeneratedCode)

            console.log(`Original (${name}):`, normalizedOriginal)
            console.log(`Regenerated (${name}):`, normalizedRegenerated)

            // Direct normalized string comparison
            expect(normalizedRegenerated).toBe(normalizedOriginal)

            console.log(`✅ ${name} - Direct normalized string comparison PASSED`)
        })
    })

    test('Structural match cases with key element checks', () => {
        structuralMatchCases.forEach(({ name, code }) => {
            const jeon = js2jeon(code)
            const regeneratedCode = jeon2js(jeon)

            const normalizedOriginal = normalizeJs(code)
            const normalizedRegenerated = normalizeJs(regeneratedCode)

            console.log(`Original (${name}):`, normalizedOriginal)
            console.log(`Regenerated (${name}):`, normalizedRegenerated)

            // Check that key structural elements are preserved
            if (name === 'Function with single return') {
                expect(normalizedRegenerated).toContain('function')
            } else if (name === 'Arrow function') {
                expect(normalizedRegenerated).toContain('=>')
            }
            expect(normalizedRegenerated.length).toBeGreaterThan(0)
        })
    })

    test('Variable declaration patterns with direct normalized string comparison', () => {
        // Test separate declarations
        const separateCode = `let a = 1; let b = 2; const C = 3; const d = 5;`
        const separateJeon = js2jeon(separateCode)
        const separateRegenerated = jeon2js(separateJeon)

        const normalizedSeparateOriginal = normalizeJs(separateCode)
        const normalizedSeparateRegenerated = normalizeJs(separateRegenerated)

        console.log('Separate declarations - Original:', normalizedSeparateOriginal)
        console.log('Separate declarations - Regenerated:', normalizedSeparateRegenerated)

        // Direct normalized string comparison
        expect(normalizedSeparateRegenerated).toBe(normalizedSeparateOriginal)
        console.log('✅ Separate declarations - Direct normalized string comparison PASSED')

        // Test combined declarations
        const combinedCode = `let a = 1, b = 2; const C = 3, d = 5;`
        const combinedJeon = js2jeon(combinedCode)
        const combinedRegenerated = jeon2js(combinedJeon)

        const normalizedCombinedOriginal = normalizeJs(combinedCode)
        const normalizedCombinedRegenerated = normalizeJs(combinedRegenerated)

        console.log('Combined declarations - Original:', normalizedCombinedOriginal)
        console.log('Combined declarations - Regenerated:', normalizedCombinedRegenerated)

        // Direct normalized string comparison
        expect(normalizedCombinedRegenerated).toBe(normalizedCombinedOriginal)
        console.log('✅ Combined declarations - Direct normalized string comparison PASSED')

        // Both should have valid regenerated code
        expect(normalizedSeparateRegenerated.length).toBeGreaterThan(0)
        expect(normalizedCombinedRegenerated.length).toBeGreaterThan(0)
    })
})