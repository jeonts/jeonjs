import { evalJeon } from '../safeEval'

// Test all supported unary operators
const testCases = [
    {
        name: 'Unary minus',
        jeon: { '-': '@a' },
        context: { a: 5 },
        expected: -5
    },
    {
        name: 'Unary plus',
        jeon: { '+': '@a' },
        context: { a: -5 },
        expected: -5
    },
    {
        name: 'Logical NOT',
        jeon: { '!': '@a' },
        context: { a: true },
        expected: false
    },
    {
        name: 'Complex expression: -a + -b',
        jeon: {
            '+': [
                { '-': '@a' },
                { '-': '@b' }
            ]
        },
        context: { a: 6, b: 7 },
        expected: -13
    },
    {
        name: 'Function body with return',
        jeon: [
            {
                return: {
                    '+': [
                        { '-': '@a' },
                        { '-': '@b' }
                    ]
                }
            }
        ],
        context: { a: 6, b: 7 },
        expected: -13
    }
]

console.log('=== Comprehensive Unary Operator Tests ===\n')

testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.name}`)
    console.log('JEON:', JSON.stringify(testCase.jeon, null, 2))
    console.log('Context:', testCase.context)

    try {
        const result = evalJeon(testCase.jeon, testCase.context)
        console.log('Result:', result)
        console.log('Expected:', testCase.expected)
        console.log('Match:', result === testCase.expected ? '✅ PASS' : '❌ FAIL')
    } catch (error: any) {
        console.log('Error:', error.message)
        console.log('❌ FAIL (Exception)')
    }

    console.log('---\n')
})