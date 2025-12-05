// Consolidated Conversion Tests with Expected Outputs
// This file consolidates multiple similar test files to reduce redundancy and clearly shows expected outputs
import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { normalizeJs } from './testUtils'

// Test different function types (consolidated from function.test.ts and function.test.test.ts)
const functionTests = [
    {
        name: 'Simple function declaration',
        code: `function add(a, b) { return a + b; }`,
        expectedElements: ['function', 'add', 'return']
    },
    {
        name: 'Function with no parameters',
        code: `function greet() { return "Hello"; }`,
        expectedElements: ['function', 'greet', 'return', 'Hello']
    },
    {
        name: 'Function with multiple statements',
        code: `function calculate(x, y) { const sum = x + y; const product = x * y; return sum + product; }`,
        expectedElements: ['function', 'calculate', 'const', 'return']
    },
    {
        name: 'Named function',
        code: `function a(name) { return ("Hello, " + name) }`,
        expectedElements: ['function', 'a', 'return', 'Hello']
    },
    {
        name: 'Arrow function',
        code: `(x) => { return (x * 2); }`,
        expectedElements: ['=>', 'return', '*']
    },
    {
        name: 'Anonymous function expression',
        code: `(function(name) { return ("Hello, " + name) })`,
        expectedElements: ['function', 'return', 'Hello']
    }
]

test('Function Conversion Tests', () => {
    functionTests.forEach(({ name, code, expectedElements }) => {
        test(`Round-trip conversion for ${name}`, () => {
            // Convert JS to JEON
            const jeon = js2jeon(code)
            expect(jeon).toBeDefined()
            expect(typeof jeon).toBe('object')

            // Convert JEON back to JS
            const regeneratedCode = jeon2js(jeon)
            expect(regeneratedCode).toBeDefined()
            expect(typeof regeneratedCode).toBe('string')

            // Normalize both codes for comparison
            const normalizedOriginal = normalizeJs(code)
            const normalizedRegenerated = normalizeJs(regeneratedCode)

            console.log(`${name} - Original:`, normalizedOriginal)
            console.log(`${name} - Regenerated:`, normalizedRegenerated)

            // Check that key elements are preserved
            expect(normalizedRegenerated.length).toBeGreaterThan(0)

            // Check for expected elements
            expectedElements.forEach(element => {
                expect(normalizedRegenerated).toContain(element)
            })

            // Ensure the regenerated code is valid (has content)
            expect(normalizedRegenerated.length).toBeGreaterThan(0)
        })
    })
})

// Test variable declaration patterns (consolidated from variablePatternComparison.test.ts, bothVariablePatternsTest.test.ts, etc.)
const variableTests = [
    {
        name: 'Separate variable declarations',
        code: `let a = 1; let b = 2; const C = 3; const d = 5;`,
        expectedElements: ['let a = 1', 'let b = 2', 'const C = 3', 'const d = 5']
    },
    {
        name: 'Combined variable declarations',
        code: `let a = 1, b = 2; const C = 3, d = 5;`,
        expectedElements: ['let a = 1', 'let b = 2', 'const C = 3', 'const d = 5']
    },
    {
        name: 'Mixed variable declarations',
        code: `let x = 1; let y = 2, z = 3; const A = 4; const B = 5, C = 6;`,
        expectedElements: ['let x = 1', 'let y = 2', 'let z = 3', 'const A = 4', 'const B = 5', 'const C = 6']
    },
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

test('Variable Declaration Pattern Tests', () => {
    variableTests.forEach(({ name, code, expectedElements }) => {
        test(`${name} round-trip conversion`, () => {
            const jeon = js2jeon(code)
            const regeneratedCode = jeon2js(jeon)

            const normalizedOriginal = normalizeJs(code)
            const normalizedRegenerated = normalizeJs(regeneratedCode)

            console.log(`${name} - Original:`, normalizedOriginal)
            console.log(`${name} - Regenerated:`, normalizedRegenerated)

            expect(jeon).toBeDefined()
            expect(typeof jeon).toBe('object')
            expect(regeneratedCode).toBeDefined()
            expect(typeof regeneratedCode).toBe('string')

            // Check for expected elements
            expectedElements.forEach(element => {
                expect(normalizedRegenerated).toContain(element)
            })

            // Check that the regenerated code has content
            expect(normalizedRegenerated.length).toBeGreaterThan(0)
        })
    })
})

// Test let and const declarations (from letConst.test.ts and letConst.test.test.ts)
const letConstTests = [
    {
        name: 'Simple let declaration',
        code: `let x = 10;`,
        expectedElements: ['let', 'x = 10']
    },
    {
        name: 'Simple const declaration',
        code: `const y = 20;`,
        expectedElements: ['const', 'y = 20']
    },
    {
        name: 'Multiple let declarations',
        code: `let a = 1, b = 2, c = 3;`,
        expectedElements: ['let', 'a = 1', 'b = 2', 'c = 3']
    },
    {
        name: 'Multiple const declarations',
        code: `const p = 100, q = 200;`,
        expectedElements: ['const', 'p = 100', 'q = 200']
    },
    {
        name: 'Mixed let and const',
        code: `let counter = 0; const MAX = 10;`,
        expectedElements: ['let counter = 0', 'const MAX = 10']
    }
]

test('Let and Const Declaration Tests', () => {
    letConstTests.forEach(({ name, code, expectedElements }) => {
        test(`Round-trip conversion for ${name}`, () => {
            // Convert JS to JEON
            const jeon = js2jeon(code)
            expect(jeon).toBeDefined()
            expect(typeof jeon).toBe('object')

            // Convert JEON back to JS
            const regeneratedCode = jeon2js(jeon)
            expect(regeneratedCode).toBeDefined()
            expect(typeof regeneratedCode).toBe('string')

            // Normalize both codes for comparison
            const normalizedOriginal = normalizeJs(code)
            const normalizedRegenerated = normalizeJs(regeneratedCode)

            console.log(`${name} - Original:`, normalizedOriginal)
            console.log(`${name} - Regenerated:`, normalizedRegenerated)

            // Check for expected elements
            expectedElements.forEach(element => {
                expect(normalizedRegenerated).toContain(element)
            })

            // Basic checks
            expect(normalizedRegenerated.length).toBeGreaterThan(0)
        })
    })
})

// Test JSON5 features (from json5Feature.test.ts and json5Feature.test.test.ts)
const json5Tests = [
    {
        name: 'Object with special keys',
        code: `const obj = { "special-key": "value", "another.key": "another value" };`,
        expectedElements: ['obj', 'special-key', 'value', 'another.key']
    },
    {
        name: 'Array with trailing comma',
        code: `const arr = [1, 2, 3,];`,
        expectedElements: ['arr', '1', '2', '3']
    },
    {
        name: 'Unquoted keys',
        code: `const config = { name: "test", value: 42 };`,
        expectedElements: ['config', 'name', 'test', 'value', '42']
    },
    {
        name: 'Comments in code',
        code: `const data = { value: 100 }; // This is a comment`,
        expectedElements: ['data', 'value', '100']
    }
]

test('JSON5 Feature Tests', () => {
    json5Tests.forEach(({ name, code, expectedElements }) => {
        test(`Round-trip conversion for ${name}`, () => {
            // Import JSON5 for these tests
            import('json5').then((JSON5) => {
                // Create a JSON-like interface for JSON5
                const JSON5Wrapper = {
                    stringify: JSON5.stringify,
                    parse: JSON5.parse,
                    [Symbol.toStringTag]: 'JSON'
                }

                // Convert JS to JEON with JSON5
                const jeon = js2jeon(code, { json: JSON5Wrapper })
                expect(jeon).toBeDefined()
                expect(typeof jeon).toBe('object')

                // Convert JEON back to JS with JSON5
                const regeneratedCode = jeon2js(jeon, { json: JSON5Wrapper })
                expect(regeneratedCode).toBeDefined()
                expect(typeof regeneratedCode).toBe('string')

                console.log(`${name} - Original:`, code)
                console.log(`${name} - Regenerated:`, regeneratedCode)

                // Check for expected elements
                expectedElements.forEach(element => {
                    expect(regeneratedCode).toContain(element)
                })

                // Basic checks
                expect(regeneratedCode.length).toBeGreaterThan(0)
            })
        })
    })
})

// Test cases for comprehensive functionality
const comprehensiveTests = [
    {
        name: 'Simple variable declarations',
        code: `let count = 0; let message = "Hello World";`,
        expectedElements: ['let count = 0', 'let message = "Hello World"']
    },
    {
        name: 'Function declaration',
        code: `function add(a, b) { return a + b; }`,
        expectedElements: ['function add', 'return a + b']
    },
    {
        name: 'Arrow function',
        code: `const multiply = (x, y) => x * y;`,
        expectedElements: ['multiply', '=>', 'x * y']
    },
    {
        name: 'Class declaration',
        code: `class Person { constructor(name) { this.name = name; } greet() { return "Hello, " + this.name; } }`,
        expectedElements: ['class Person', 'constructor', 'greet', 'this.name']
    },
    {
        name: 'Variable with const',
        code: `const PI = 3.14159; let radius = 5;`,
        expectedElements: ['const PI = 3.14159', 'let radius = 5']
    }
]

test('Comprehensive Round-trip Tests', () => {
    comprehensiveTests.forEach(({ name, code, expectedElements }) => {
        test(`Round-trip conversion for ${name}`, () => {
            // Convert JS to JEON
            const jeon = js2jeon(code)
            expect(jeon).toBeDefined()
            expect(typeof jeon).toBe('object')

            // Convert JEON back to JS
            const regeneratedCode = jeon2js(jeon)
            expect(regeneratedCode).toBeDefined()
            expect(typeof regeneratedCode).toBe('string')

            console.log(`${name} - Original:`, code)
            console.log(`${name} - JEON:`, JSON.stringify(jeon, null, 2))
            console.log(`${name} - Regenerated:`, regeneratedCode)

            // Check for expected elements
            expectedElements.forEach(element => {
                expect(regeneratedCode).toContain(element)
            })

            // Basic checks
            expect(regeneratedCode.length).toBeGreaterThan(0)
        })
    })
})

console.log('🎉 All consolidated conversion tests completed!')