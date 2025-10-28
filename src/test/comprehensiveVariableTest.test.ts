import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'

// Test cases for various variable declaration scenarios
const testCases = [
    {
        name: 'Simple let declarations',
        code: `let count = 0; let message = "Hello World";`
    },
    {
        name: 'Mixed let and const',
        code: `let count = 0; const MAX = 100; let message = "Hello";`
    },
    {
        name: 'Separated declarations',
        code: `let a = 1; let b = 2; const C = 3; const D = 4; let e = 5;`
    },
    {
        name: 'With other statements',
        code: `let a = 1; let b = 2; function test() { return a + b; } const C = 3;`
    }
]

test('Comprehensive Variable Declaration Tests', () => {
    testCases.forEach(({ name, code }) => {
        test(`Converts ${name}`, () => {
            try {
                const jeon = js2jeon(code)
                expect(jeon).toBeDefined()
                expect(typeof jeon).toBe('object')
                
                console.log(`${name} - Input:`, code)
                console.log(`${name} - Output:`, JSON.stringify(jeon, null, 2))
            } catch (error: any) {
                expect(error).toBeUndefined() // This will fail and show the error
            }
        })
    })
})