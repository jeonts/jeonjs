import { evalJeon } from '../safeEval'

// Test the original issue case
const jeon = [
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

console.log('JEON:', JSON.stringify(jeon, null, 2))
console.log('Context:', context)

try {
    const result = evalJeon(jeon, context)
    console.log('Result:', result)
    console.log('Result type:', typeof result)

    // Verify it's the correct mathematical result
    // -a + -b = -6 + -7 = -13
    console.log('Expected: -13')
    console.log('Match:', result === -13 ? '✅ YES' : '❌ NO')
} catch (error: any) {
    console.log('Error:', error.message)
}