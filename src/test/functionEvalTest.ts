import { evalJeon } from '../safeEval'

// Test the function from the query
const functionBody = [
    {
        return: {
            '+': [
                {
                    '-': '@a',
                },
                {
                    '-': '@b',
                },
            ],
        },
    },
]

const context = { a: 6, b: 7 }

console.log('Function body JEON:', JSON.stringify(functionBody, null, 2))
console.log('Context:', context)

try {
    // Simulate the function call: evalJeon(functionBody, {a: a, b: b})
    const result = evalJeon(functionBody, context)
    console.log('Result:', result)
    console.log('Result type:', typeof result)

    // Verify it's the correct mathematical result
    // -a + -b = -6 + -7 = -13
    console.log('Expected: -13')
    console.log('Match:', result === -13 ? '✅ YES' : '❌ NO')
} catch (error: any) {
    console.log('Error:', error.message)
}