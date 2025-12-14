import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

// Test cases for rest parameters
const testCases = [
    {
        name: 'case35 - IIFE with rest parameter',
        code: `(function(...a) { return a.length })([1, 2, 3, 4, 5])`,
        expected: 1
    },
    {
        name: 'case36 - Function declaration with rest parameter',
        code: `function a(...a) { return a.length }
a(1, 2, 3, 4, 5)`,
        expected: 5
    },
    {
        name: 'Object destructuring with rest',
        code: `const {a,b, ...rest} = {a:1, b:3, c:4, d:5}
a+b+rest.c`,
        expected: 8
    },
    {
        name: 'Array destructuring with rest',
        code: `const [head, ...rest] = [1, 2, 3, 4, 5]
head + rest.length`,
        expected: 5
    }
]

console.log('Testing rest parameter handling...\n')

for (const testCase of testCases) {
    try {
        console.log(`Testing: ${testCase.name}`)
        console.log(`Code: ${testCase.code}`)

        // Convert JS to JEON
        const jeon = js2jeon(testCase.code)
        console.log(`JEON:`, JSON.stringify(jeon, null, 2))

        // Evaluate JEON
        const result = evalJeon(jeon)
        console.log(`Result: ${result}`)
        console.log(`Expected: ${testCase.expected}`)

        if (result === testCase.expected) {
            console.log('✅ Test passed\n')
        } else {
            console.log('❌ Test failed\n')
        }
    } catch (error) {
        console.error(`❌ Test failed with error: ${(error as Error).message}\n`)
    }
}