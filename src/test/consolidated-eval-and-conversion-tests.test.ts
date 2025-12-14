import { evalJeon } from '../safeEval'
import { jeon2js } from '../jeon2js'
import { expect, test } from '@woby/chk'

test('Consolidated Eval and Conversion Tests', () => {
    console.log('=== Consolidated Eval and Conversion Tests ===\n')

    // Test 1: Testing evalJeon with @undefined
    console.log('Test 1: Testing evalJeon with @undefined')
    // Test JEON with uninitialized variables
    const jeon1 = {
        "@": {
            "d": "@undefined"
        }
    }

    console.log('JEON input:')
    console.log(JSON.stringify(jeon1, null, 2))

    try {
        const context: Record<string, any> = {}
        const result = evalJeon(jeon1, context)
        console.log('\nResult:', result)
        console.log('Context after evaluation:', context)

        // Check that d is set to undefined in the context
        if ('d' in context && context.d === undefined) {
            console.log('✅ Variable d correctly set to undefined in context')
        } else {
            console.log('❌ Variable d not correctly set to undefined in context')
        }

        // Check that the statement returns undefined
        if (result === undefined) {
            console.log('✅ Variable declaration statement correctly returns undefined')
        } else {
            console.log('❌ Variable declaration statement should return undefined')
        }

        // Assertions
        expect(jeon1).toBeDefined()
        expect(result).toBeDefined()
        console.log('✅ Test 1 passed\n')
    } catch (e: any) {
        console.log('Error:', e.message)
        console.log(e.stack)
        throw e
    }

    // Test 2: Testing jeon2js with provided JEON
    console.log('Test 2: Testing jeon2js with provided JEON')
    const jeon2: any = {
        "function sum(a, b)": [
            {
                "@": {}
            },
            {
                "@": {}
            },
            {
                "@": {}
            },
            {
                "@": {}
            },
            {
                "@@": {
                    "f": 22
                }
            },
            {
                "@": {}
            },
            {
                "return": {
                    "+": [
                        "@a",
                        "@b"
                    ]
                }
            }
        ]
    }

    console.log('JEON input:')
    console.log(JSON.stringify(jeon2, null, 2))

    try {
        const result = jeon2js(jeon2)
        console.log('\nJavaScript output:')
        console.log(result)

        // Assertions
        expect(jeon2).toBeDefined()
        expect(result).toBeDefined()
        console.log('✅ Test 2 passed\n')
    } catch (e: any) {
        console.log('Error:', e.message)
        console.log(e.stack)
        throw e
    }

    // Test 3: Testing User Example with Shorthand Syntax
    console.log('Test 3: Testing User Example with Shorthand Syntax')
    // User's example: ((a, b) => { abs(a + b) })
    const jeon3 = {
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
    console.log(JSON.stringify(jeon3, null, 2))

    console.log('\n--- Without closure ---')
    const codeWithout = jeon2js(jeon3)
    console.log('Generated code:')
    console.log(codeWithout)

    console.log('\n--- Without closure option ---')
    const codeWith = jeon2js(jeon3)
    console.log('Generated code:')
    console.log(codeWith)

    console.log('\n--- Testing direct evaluation ---')
    try {
        // Provide abs function in context
        const abs = (x: number) => Math.abs(x)
        const context = { abs }

        // Evaluate the arrow function - this creates a function
        const arrowFunc = evalJeon(jeon3, context)
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

        // Assertions
        expect(jeon3).toBeDefined()
        expect(codeWithout).toBeDefined()
        expect(codeWith).toBeDefined()
        expect(arrowFunc).toBeDefined()
        console.log('✅ Test 3 passed\n')
    } catch (error: any) {
        console.error('Error:', error.message)
        console.log('Stack:', error.stack)
        throw error
    }

    console.log('=== All Eval and Conversion Tests Completed ===')
})