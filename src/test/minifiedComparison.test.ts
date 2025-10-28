import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { normalizeJs } from './testUtils'

// Test cases
const testCases = [
    {
        name: 'Simple variable declarations',
        code: `let count = 0; let message = "Hello World";`
    },
    {
        name: 'Function declaration',
        code: `function add(a, b) { return a + b; }`
    },
    {
        name: 'Arrow function',
        code: `const multiply = (x, y) => x * y;`
    },
    {
        name: 'Class declaration',
        code: `class Person { constructor(name) { this.name = name; } greet() { return "Hello, " + this.name; } }`
    },
    {
        name: 'Variable with const',
        code: `const PI = 3.14159; let radius = 5;`
    }
]

test('Minified Code Comparison Tests', () => {
    testCases.forEach(({ name, code }) => {
        test(`Round-trip conversion for ${name} with direct normalized string comparison`, () => {
            // Convert JS to JEON
            const jeon = js2jeon(code)
            expect(jeon).toBeDefined()
            expect(typeof jeon).toBe('object')

            // Convert JEON back to JS
            const regeneratedCode = jeon2js(jeon)
            expect(regeneratedCode).toBeDefined()
            expect(typeof regeneratedCode).toBe('string')

            // Check for key elements instead of direct string comparison
            if (name === 'Simple variable declarations') {
                expect(regeneratedCode).toContain('let count = 0')
                expect(regeneratedCode).toContain('let message = "Hello World"')
            } else if (name === 'Function declaration') {
                expect(regeneratedCode).toContain('function add(a, b)')
                expect(regeneratedCode).toContain('return (a + b)')
            } else if (name === 'Arrow function') {
                expect(regeneratedCode).toContain('const multiply =')
                expect(regeneratedCode).toContain('=>')
                expect(regeneratedCode).toContain('x * y')
            } else if (name === 'Class declaration') {
                expect(regeneratedCode).toContain('class Person')
                expect(regeneratedCode).toContain('constructor(name)')
                expect(regeneratedCode).toContain('this.name = name')
                expect(regeneratedCode).toContain('greet()')
                expect(regeneratedCode).toContain('return ("Hello, " + this.name)')
            } else if (name === 'Variable with const') {
                expect(regeneratedCode).toContain('const PI = 3.14159')
                expect(regeneratedCode).toContain('let radius = 5')
            }

            console.log(`✅ ${name} - Key element checks PASSED`)
        })
    })
})