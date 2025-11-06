import { evalJeon } from '../safeEval'

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
} catch (error: any) {
    console.log('Error:', error.message)
}