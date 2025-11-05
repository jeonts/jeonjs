import { jeon2js } from '../jeon2js'
import { evalJeon } from '../safeEval'

console.log('=== Testing User Example with Shorthand Syntax ===\n')

// User's example: ((a, b) => { abs(a + b) })
const jeon = {
    '(': {
        '(a, b) =>': {
            'abs()': [
                {
                    '+': [
                        '@a',
                        '@b'
                    ]
                }
            ]
        }
    }
}

console.log('JEON input:')
console.log(JSON.stringify(jeon, null, 2))

console.log('\n--- Without closure ---')
const codeWithout = jeon2js(jeon, { closure: false })
console.log('Generated code:')
console.log(codeWithout)

console.log('\n--- With closure ---')
const codeWith = jeon2js(jeon, { closure: true })
console.log('Generated code:')
console.log(codeWith)

console.log('\n--- Testing direct evaluation ---')
try {
    // Provide abs function in context
    const abs = (x: number) => Math.abs(x)
    const context = { abs }

    // Evaluate the arrow function - this creates a function
    const arrowFunc = evalJeon(jeon, context)
    console.log('Arrow function created:', typeof arrowFunc)

    if (typeof arrowFunc === 'function') {
        // Test the function
        const result1 = arrowFunc(5, 3)
        console.log('Result of func(5, 3):', result1)
        console.log('Expected: 8')
        console.log('Test:', result1 === 8 ? '✅ PASSED' : '❌ FAILED')

        const result2 = arrowFunc(-5, -3)
        console.log('Result of func(-5, -3):', result2)
        console.log('Expected: 8')
        console.log('Test:', result2 === 8 ? '✅ PASSED' : '❌ FAILED')
    }
} catch (error: any) {
    console.error('Error:', error.message)
    console.log('Stack:', error.stack)
}

console.log('\n=== Test Complete ===')
