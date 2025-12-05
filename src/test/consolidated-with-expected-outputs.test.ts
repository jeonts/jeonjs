// Consolidated Tests with Clear Expected Outputs
// This file demonstrates the expected behavior of the JEON converter with clear expected outputs
import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { normalizeJs } from './testUtils'

// Test cases with clear expected outputs
const conversionTestCases = [
    {
        name: 'Simple variable declaration',
        input: 'let x = 5;',
        expectedOutputContains: ['let x = 5']
    },
    {
        name: 'Function declaration',
        input: 'function add(a, b) { return a + b; }',
        expectedOutputContains: ['function add', 'return a + b']
    },
    {
        name: 'Arrow function',
        input: 'const multiply = (x, y) => x * y;',
        expectedOutputContains: ['multiply', '=>', 'x * y']
    },
    {
        name: 'Class declaration',
        input: 'class Person { constructor(name) { this.name = name; } }',
        expectedOutputContains: ['class Person', 'constructor', 'this.name = name']
    },
    {
        name: 'Object literal',
        input: 'const config = { api: "https://api.example.com", timeout: 5000 };',
        expectedOutputContains: ['config', 'api', 'https://api.example.com', 'timeout', '5000']
    },
    {
        name: 'Array literal',
        input: 'const items = [1, 2, 3, "test"];',
        expectedOutputContains: ['items', '1', '2', '3', 'test']
    },
    {
        name: 'Async function',
        input: 'async function fetchData() { const response = await fetch("/api"); return response; }',
        expectedOutputContains: ['async function fetchData', 'await fetch', 'return response']
    }
]

test('Conversion Tests with Expected Outputs', () => {
    conversionTestCases.forEach(({ name, input, expectedOutputContains }) => {
        test(`${name}`, () => {
            // Step 1: Convert JS to JEON
            const jeon = js2jeon(input)
            expect(jeon).toBeDefined()
            expect(typeof jeon).toBe('object')

            // Step 2: Convert JEON back to JS
            const output = jeon2js(jeon)
            expect(output).toBeDefined()
            expect(typeof output).toBe('string')

            console.log(`Input (${name}):`, input)
            console.log(`JEON:`, JSON.stringify(jeon, null, 2))
            console.log(`Output:`, output)

            // Step 3: Verify expected elements are present
            expectedOutputContains.forEach(element => {
                expect(output).toContain(element)
            })

            console.log(`✅ ${name} PASSED`)
        })
    })
})

// Round-trip conversion tests with expected behavior
const roundTripTestCases = [
    {
        name: 'Variable declarations - separate',
        code: 'let a = 1; let b = 2; const C = 3;',
        expectedElements: ['let a = 1', 'let b = 2', 'const C = 3']
    },
    {
        name: 'Variable declarations - combined',
        code: 'let x = 1, y = 2; const A = 3, B = 4;',
        expectedElements: ['let x = 1', 'let y = 2', 'const A = 3', 'const B = 4']
    },
    {
        name: 'Function with multiple parameters',
        code: 'function calculate(x, y, z) { return x + y * z; }',
        expectedElements: ['function calculate', 'x, y, z', 'return x + y * z']
    },
    {
        name: 'Arrow function with expression body',
        code: 'const square = x => x * x;',
        expectedElements: ['square', '=>', 'x * x']
    },
    {
        name: 'Class with methods',
        code: 'class Calculator { add(a, b) { return a + b; } multiply(x, y) { return x * y; } }',
        expectedElements: ['class Calculator', 'add(a, b)', 'return a + b', 'multiply(x, y)', 'return x * y']
    }
]

test('Round-trip Conversion Tests', () => {
    roundTripTestCases.forEach(({ name, code, expectedElements }) => {
        test(`${name}`, () => {
            // Convert JS → JEON → JS
            const jeon = js2jeon(code)
            const regeneratedCode = jeon2js(jeon)

            console.log(`Original (${name}):`, code)
            console.log(`JEON:`, JSON.stringify(jeon, null, 2))
            console.log(`Regenerated:`, regeneratedCode)

            // Verify expected elements are present
            expectedElements.forEach(element => {
                expect(regeneratedCode).toContain(element)
            })

            console.log(`✅ ${name} round-trip conversion PASSED`)
        })
    })
})

// Edge case tests
test('Edge Case Tests', () => {
    test('Empty statements', () => {
        const code = ';;;'
        const jeon = js2jeon(code)
        const output = jeon2js(jeon)

        expect(output).toBeDefined()
        console.log('Empty statements - Input:', code)
        console.log('Empty statements - Output:', output)
        console.log('✅ Empty statements test PASSED')
    })

    test('Nested expressions', () => {
        const code = '(2 + 3) * (4 - 1)'
        const jeon = js2jeon(code)
        const output = jeon2js(jeon)

        expect(output).toContain('*')
        expect(output).toContain('+')
        expect(output).toContain('-')

        console.log('Nested expressions - Input:', code)
        console.log('Nested expressions - Output:', output)
        console.log('✅ Nested expressions test PASSED')
    })
})

console.log('🎉 All consolidated tests with expected outputs completed!')