import { evalJeon } from '../safeEval'
import { expect, test } from '@woby/chk'

test('Debug evalJeon with arithmetic operations', () => {
    // Test the problematic case
    const jeon = [
        {
            return: {
                '+': [
                    { '-': '@a' },
                    { '-': '@b' }
                ]
            }
        }
    ]

    const context = { a: 6, b: 7 }

    console.log('JEON:', JSON.stringify(jeon, null, 2))
    console.log('Context:', context)

    try {
        const result = evalJeon(jeon, context)
        console.log('Result:', result)
        console.log('Result type:', typeof result)

        // Assertions
        expect(jeon).toBeDefined()
        expect(context).toBeDefined()
    } catch (error: any) {
        console.log('Error:', error.message)
        console.log(error.stack)
        throw error
    }
})