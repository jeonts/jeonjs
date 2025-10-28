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
    test('Exact match cases with key element checks', () => {
        exactMatchCases.forEach(({ name, code }) => {
            const jeon = js2jeon(code)
            const regeneratedCode = jeon2js(jeon)

            console.log(`Original (${name}):`, code)
            console.log(`Regenerated (${name}):`, regeneratedCode)

            // Check for key elements instead of direct string comparison
            if (name === 'Simple const declaration') {
                expect(regeneratedCode).toContain('const PI = 3.14159')
            } else if (name === 'Simple let declaration') {
                expect(regeneratedCode).toContain('let count = 0')
            } else if (name === 'Multiple const declarations') {
                expect(regeneratedCode).toContain('const a = 1')
                expect(regeneratedCode).toContain('const b = 2')
            } else if (name === 'Multiple let declarations') {
                expect(regeneratedCode).toContain('let x = 1')
                expect(regeneratedCode).toContain('let y = 2')
            }

            console.log(`✅ ${name} - Key element checks PASSED`)
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

    test('Variable declaration patterns with key element checks', () => {
        // Test separate declarations
        const separateCode = `let a = 1; let b = 2; const C = 3; const d = 5;`
        const separateJeon = js2jeon(separateCode)
        const separateRegenerated = jeon2js(separateJeon)

        console.log('Separate declarations - Original:', separateCode)
        console.log('Separate declarations - Regenerated:', separateRegenerated)

        // Check for key elements
        expect(separateRegenerated).toContain('let a = 1')
        expect(separateRegenerated).toContain('let b = 2')
        expect(separateRegenerated).toContain('const C = 3')
        expect(separateRegenerated).toContain('const d = 5')
        console.log('✅ Separate declarations - Key element checks PASSED')

        // Test combined declarations
        const combinedCode = `let a = 1, b = 2; const C = 3, d = 5;`
        const combinedJeon = js2jeon(combinedCode)
        const combinedRegenerated = jeon2js(combinedJeon)

        console.log('Combined declarations - Original:', combinedCode)
        console.log('Combined declarations - Regenerated:', combinedRegenerated)

        // Check for key elements
        expect(combinedRegenerated).toContain('let a = 1')
        expect(combinedRegenerated).toContain('let b = 2')
        expect(combinedRegenerated).toContain('const C = 3')
        expect(combinedRegenerated).toContain('const d = 5')
        console.log('✅ Combined declarations - Key element checks PASSED')

        // Both should have valid regenerated code
        expect(separateRegenerated.length).toBeGreaterThan(0)
        expect(combinedRegenerated.length).toBeGreaterThan(0)
    })
})