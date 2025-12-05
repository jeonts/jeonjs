// Consolidated Round-trip Tests with Expected Outputs
// This file consolidates multiple round-trip test files with clear expected outputs
import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { normalizeJs } from './testUtils'

// Test cases for variable round-trip conversions
test('Variable Round-trip Tests', () => {
    test('Separate declarations round-trip conversion', () => {
        // Test 1: Separate declarations
        console.log('\n1. Separate declarations:')
        const code1 = `let a = 1; let b = 2; const C = 3; const d = 5;`
        try {
            console.log('Original:', code1)
            const jeon1 = js2jeon(code1)
            console.log('JEON:')
            console.log(JSON.stringify(jeon1, null, 2))

            const regenerated1 = jeon2js(jeon1)
            console.log('Regenerated:')
            console.log(regenerated1)

            // Check for key elements instead of direct string comparison
            expect(regenerated1).toContain('let a = 1')
            expect(regenerated1).toContain('let b = 2')
            expect(regenerated1).toContain('const C = 3')
            expect(regenerated1).toContain('const d = 5')

            console.log('\n✅ Separate declarations round-trip conversion with key element checks PASSED')

            expect(jeon1).toBeDefined()
            expect(regenerated1).toBeDefined()
        } catch (error) {
            console.error('Error:', error)
            expect(error).toBeUndefined()
        }
    })

    test('Combined declarations round-trip conversion', () => {
        // Test 2: Combined declarations
        console.log('\n2. Combined declarations:')
        const code2 = `let a = 1, b = 2; const C = 3, d = 5;`
        try {
            console.log('Original:', code2)
            const jeon2 = js2jeon(code2)
            console.log('JEON:')
            console.log(JSON.stringify(jeon2, null, 2))

            const regenerated2 = jeon2js(jeon2)
            console.log('Regenerated:')
            console.log(regenerated2)

            // Check for key elements instead of direct string comparison
            expect(regenerated2).toContain('let a = 1')
            expect(regenerated2).toContain('let b = 2')
            expect(regenerated2).toContain('const C = 3')
            expect(regenerated2).toContain('const d = 5')

            console.log('\n✅ Combined declarations round-trip conversion with key element checks PASSED')

            expect(jeon2).toBeDefined()
            expect(regenerated2).toBeDefined()
        } catch (error) {
            console.error('Error:', error)
            expect(error).toBeUndefined()
        }
    })
})

// Test function round-trip conversions
test('Function Round-trip Tests', () => {
    // Test different function types
    const namedFunctionCode = `function a(name) { return ("Hello, " + name) }`
    const arrowFunctionCode = `(x) => { return (x * 2); }`
    const anonymousFunctionCode = `(function(name) { return ("Hello, " + name) })`

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

        // Expected output elements
        const expectedElements = ['function', 'a', 'name', 'return', 'Hello']

        // Check that the regenerated code contains expected elements
        expectedElements.forEach(element => {
            expect(normalizedRegenerated).toContain(element)
        })
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

        // Expected output elements
        const expectedElements = ['=>', 'x', 'return', '*']

        // Check that the regenerated code contains expected elements
        expectedElements.forEach(element => {
            expect(normalizedRegenerated).toContain(element)
        })
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

        // Expected output elements
        const expectedElements = ['function', 'name', 'return', 'Hello']

        // Check that the regenerated code contains expected elements
        expectedElements.forEach(element => {
            expect(normalizedRegenerated).toContain(element)
        })
    })
})

// Test web interface functionality
test('Web Interface Test', () => {
    // Test the conversion that was mentioned in the issue
    const testCode = `function a(name) { return ("Hello, " + name) }`

    console.log('=== Testing function a(name) conversion ===')
    const jeonResult = js2jeon(testCode)
    console.log('JEON output:')
    console.log(JSON.stringify(jeonResult, null, 2))

    test('Converts function a(name) to JEON and back with key element checks', () => {
        if (jeonResult && !jeonResult.error) {
            const jsResult = jeon2js(jeonResult)
            console.log('\nJavaScript output:')
            console.log(jsResult)

            // Expected output elements
            const expectedElements = ['function a', 'return', 'Hello', 'name']

            // Check for key elements instead of direct string comparison
            expectedElements.forEach(element => {
                expect(jsResult).toContain(element)
            })

            console.log('\n✅ Key element checks PASSED')

            expect(jsResult).toBeDefined()
        } else {
            console.log('\nError in JEON conversion:')
            console.log(jeonResult)
            expect(jeonResult).toBeUndefined()
        }
    })
})

// Test direct code comparison functionality
test('Direct Code Comparison Tests', () => {
    // Test cases where we expect high similarity after round-trip conversion
    const exactMatchCases = [
        {
            name: 'Simple const declaration',
            code: `const PI = 3.14159;`,
            expectedElements: ['const PI = 3.14159']
        },
        {
            name: 'Simple let declaration',
            code: `let count = 0;`,
            expectedElements: ['let count = 0']
        },
        {
            name: 'Multiple const declarations',
            code: `const a = 1, b = 2;`,
            expectedElements: ['const a = 1', 'const b = 2']
        },
        {
            name: 'Multiple let declarations',
            code: `let x = 1, y = 2;`,
            expectedElements: ['let x = 1', 'let y = 2']
        }
    ]

    test('Exact match cases with key element checks', () => {
        exactMatchCases.forEach(({ name, code, expectedElements }) => {
            const jeon = js2jeon(code)
            const regeneratedCode = jeon2js(jeon)

            console.log(`Original (${name}):`, code)
            console.log(`Regenerated (${name}):`, regeneratedCode)

            // Check for expected elements
            expectedElements.forEach(element => {
                expect(regeneratedCode).toContain(element)
            })

            console.log(`✅ ${name} - Key element checks PASSED`)
        })
    })

    test('Variable declaration patterns with key element checks', () => {
        // Test separate declarations
        const separateCode = `let a = 1; let b = 2; const C = 3; const d = 5;`
        const separateJeon = js2jeon(separateCode)
        const separateRegenerated = jeon2js(separateJeon)

        console.log('Separate declarations - Original:', separateCode)
        console.log('Separate declarations - Regenerated:', separateRegenerated)

        // Expected elements for separate declarations
        const separateExpectedElements = ['let a = 1', 'let b = 2', 'const C = 3', 'const d = 5']

        // Check for key elements
        separateExpectedElements.forEach(element => {
            expect(separateRegenerated).toContain(element)
        })
        console.log('✅ Separate declarations - Key element checks PASSED')

        // Test combined declarations
        const combinedCode = `let a = 1, b = 2; const C = 3, d = 5;`
        const combinedJeon = js2jeon(combinedCode)
        const combinedRegenerated = jeon2js(combinedJeon)

        console.log('Combined declarations - Original:', combinedCode)
        console.log('Combined declarations - Regenerated:', combinedRegenerated)

        // Expected elements for combined declarations
        const combinedExpectedElements = ['let a = 1', 'let b = 2', 'const C = 3', 'const d = 5']

        // Check for key elements
        combinedExpectedElements.forEach(element => {
            expect(combinedRegenerated).toContain(element)
        })
        console.log('✅ Combined declarations - Key element checks PASSED')

        // Both should have valid regenerated code
        expect(separateRegenerated.length).toBeGreaterThan(0)
        expect(combinedRegenerated.length).toBeGreaterThan(0)
    })
})

// Test comprehensive variable declaration grouping
test('Comprehensive Variable Declaration Grouping Test', () => {
    test('Module level declarations', () => {
        const code = `let a = 1; let b = 2; const C = 3;`
        try {
            const jeon = js2jeon(code)
            expect(jeon).toBeDefined()
            expect(typeof jeon).toBe('object')

            console.log('Module level - Input:', code)
            console.log('Module level - Output:', JSON.stringify(jeon, null, 2))

            // Expected structure elements
            expect(JSON.stringify(jeon)).toContain('let')
            expect(JSON.stringify(jeon)).toContain('const')
            expect(JSON.stringify(jeon)).toContain('a')
            expect(JSON.stringify(jeon)).toContain('b')
            expect(JSON.stringify(jeon)).toContain('C')
        } catch (error: any) {
            expect(error).toBeUndefined() // This will fail and show the error
        }
    })

    test('Function level declarations', () => {
        const code = `function test() { let a = 1; let b = 2; const C = 3; return a + b; }`
        try {
            const jeon = js2jeon(code)
            expect(jeon).toBeDefined()
            expect(typeof jeon).toBe('object')

            console.log('Function level - Input:', code)
            console.log('Function level - Output:', JSON.stringify(jeon, null, 2))

            // Expected structure elements
            expect(JSON.stringify(jeon)).toContain('function')
            expect(JSON.stringify(jeon)).toContain('test')
            expect(JSON.stringify(jeon)).toContain('let')
            expect(JSON.stringify(jeon)).toContain('const')
            expect(JSON.stringify(jeon)).toContain('return')
        } catch (error: any) {
            expect(error).toBeUndefined() // This will fail and show the error
        }
    })

    test('Arrow function level declarations', () => {
        const code = `const arrow = () => { let a = 1; let b = 2; const C = 3; return a + b; };`
        try {
            const jeon = js2jeon(code)
            expect(jeon).toBeDefined()
            expect(typeof jeon).toBe('object')

            console.log('Arrow function level - Input:', code)
            console.log('Arrow function level - Output:', JSON.stringify(jeon, null, 2))

            // Expected structure elements
            expect(JSON.stringify(jeon)).toContain('const')
            expect(JSON.stringify(jeon)).toContain('arrow')
            expect(JSON.stringify(jeon)).toContain('let')
            expect(JSON.stringify(jeon)).toContain('const')
            expect(JSON.stringify(jeon)).toContain('return')
        } catch (error: any) {
            expect(error).toBeUndefined() // This will fail and show the error
        }
    })
})

console.log('🎉 All consolidated round-trip tests completed!')