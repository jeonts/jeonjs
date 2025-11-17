import { evalJeon } from '../safeEval'
import { expect, test } from '@woby/chk'

test('Debug evalJeon2 testing individual components', () => {
    // Test individual components
    const context = { a: 6, b: 7 }

    console.log('=== Testing individual components ===')

    // Test unary minus
    console.log('Testing unary minus -a:')
    try {
        const result = evalJeon({ '-': '@a' }, context)
        console.log('Result:', result, 'Type:', typeof result)
    } catch (error: any) {
        console.log('Error:', error.message)
    }

    console.log('\nTesting unary minus -b:')
    try {
        const result = evalJeon({ '-': '@b' }, context)
        console.log('Result:', result, 'Type:', typeof result)
    } catch (error: any) {
        console.log('Error:', error.message)
    }

    // Test addition
    console.log('\nTesting addition:')
    try {
        const result = evalJeon({
            '+': [
                { '-': '@a' },
                { '-': '@b' }
            ]
        }, context)
        console.log('Result:', result, 'Type:', typeof result)
    } catch (error: any) {
        console.log('Error:', error.message)
    }

    // Test return statement
    console.log('\nTesting return statement:')
    try {
        const result = evalJeon({
            return: {
                '+': [
                    { '-': '@a' },
                    { '-': '@b' }
                ]
            }
        }, context)
        console.log('Result:', result, 'Type:', typeof result)
    } catch (error: any) {
        console.log('Error:', error.message)
    }

    // Test array with return statement
    console.log('\nTesting array with return statement:')
    try {
        const result = evalJeon([
            {
                return: {
                    '+': [
                        { '-': '@a' },
                        { '-': '@b' }
                    ]
                }
            }
        ], context)
        console.log('Result:', result, 'Type:', typeof result)
    } catch (error: any) {
        console.log('Error:', error.message)
    }

    // Assertions
    expect(context).toBeDefined()
})