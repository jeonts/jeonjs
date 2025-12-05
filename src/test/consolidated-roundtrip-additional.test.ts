// Consolidated Round-trip Additional Tests
// This file consolidates similar round-trip test cases
import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { normalizeJs } from './testUtils'

// Test cases for round-trip conversion with different function and variable patterns
const roundTripTestCases = [
    {
        name: 'Function declarations with variable statements (semicolons)',
        code: `function sum(a, b) {let d;const f = 22;var g;  return a + b;};function min(a, b){return Math.min(a,b)};function main(a, b){return min(sum(a,b))}`,
        expectedElements: [
            'function sum(a, b)',
            'let d',
            'const f = 22',
            'var g',
            'return a + b',
            'function min(a, b)',
            'return Math.min(a,b)',
            'function main(a, b)',
            'return min(sum(a,b))'
        ]
    },
    {
        name: 'Function declarations with variable statements (without semicolons)',
        code: `function sum(a, b) {let d;const f = 22;var g;  return a + b;}
function min(a, b){return Math.min(a,b)}
function main(a, b){return min(sum(a,b))}`,
        expectedElements: [
            'function sum(a, b)',
            'let d',
            'const f = 22',
            'var g',
            'return a + b',
            'function min(a, b)',
            'return Math.min(a,b)',
            'function main(a, b)',
            'return min(sum(a,b))'
        ]
    },
    {
        name: 'Function with uninitialized variables',
        code: 'function sum(a, b) {let d;const f = 22;var g; return a + b;}',
        expectedElements: [
            'function sum(a, b)',
            'let d',
            'const f = 22',
            'var g',
            'return a + b'
        ]
    },
    {
        name: 'Variable declarations round-trip',
        code: `let count = 0; let message = "Hello World";`,
        expectedElements: [
            'let count = 0',
            'let message = "Hello World"'
        ]
    }
]

test('Consolidated Round-trip Tests', () => {
    roundTripTestCases.forEach(({ name, code, expectedElements }) => {
        test(`${name}`, () => {
            console.log(`\n=== ${name} ===`)
            console.log('Original code:')
            console.log(code)

            try {
                // Convert JS to JEON
                const jeon = js2jeon(code)
                console.log('\nJEON output:')
                console.log(JSON.stringify(jeon, null, 2))

                // Convert JEON back to JS
                const regenerated = jeon2js(jeon)
                console.log('\nRegenerated code:')
                console.log(regenerated)

                // Check for expected elements
                expectedElements.forEach(element => {
                    expect(regenerated).toContain(element)
                })

                console.log(`✅ ${name} PASSED`)
            } catch (e: any) {
                console.log('Error:', e.message)
                console.log(e.stack)
                expect(e).toBeUndefined() // This will fail and show the error
            }
        })
    })
})

// Special test for undefined variable handling
test('Round-trip Test with undefined variables', () => {
    test('Preserves uninitialized variable names', () => {
        const code = 'function sum(a, b) {let d;const f = 22;var g; return a + b;}'

        console.log('Original code:')
        console.log(code)

        try {
            // Convert JS to JEON
            const jeon = js2jeon(code)
            console.log('\nJEON output:')
            console.log(JSON.stringify(jeon, null, 2))

            // Check what we get
            const jeonString = JSON.stringify(jeon)
            console.log('\nJEON string representation:')
            console.log(jeonString)

            // Convert JEON back to JS
            const regenerated = jeon2js(jeon)
            console.log('\nRegenerated code:')
            console.log(regenerated)

            // Check that the regenerated code is correct
            expect(regenerated).toContain('let d')
            expect(regenerated).toContain('const f = 22')
            expect(regenerated).toContain('var g')
            expect(regenerated).toContain('return a + b')

            console.log('✅ Round-trip test PASSED')
        } catch (e: any) {
            console.log('Error:', e.message)
            console.log(e.stack)
            expect(e).toBeUndefined() // This will fail and show the error
        }
    })
})

console.log('🎉 All consolidated round-trip additional tests completed!')