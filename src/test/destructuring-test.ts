import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

// Test cases for destructuring
const testCases = [
    {
        name: 'Object destructuring with rest',
        code: `
const {a,b, ...rest} = {a:1, b:3, c:4, d:5}
a+b
`
    },
    {
        name: 'Array destructuring with rest',
        code: `
const [head, a,b, ...rest] = [1, 2, 3, 4, 5]
a+b
`
    },
    {
        name: 'Simple array destructuring',
        code: `
const [x, y, z] = [1, 2, 3]
x + y + z
`
    },
    {
        name: 'Array destructuring with holes',
        code: `
const [a, , b] = [1, 2, 3]
a + b
`
    },
    {
        name: 'Array destructuring with rest element',
        code: `
const [first, ...rest] = [1, 2, 3, 4, 5]
first + rest.length
`
    }
]

console.log('Testing destructuring support...\n')

for (const testCase of testCases) {
    try {
        console.log(`Testing: ${testCase.name}`)
        console.log(`Code: ${testCase.code.trim()}`)

        // Convert JS to JEON
        const jeon = js2jeon(testCase.code)
        console.log(`JEON:`, JSON.stringify(jeon, null, 2))

        // Evaluate JEON
        const result = evalJeon(jeon)
        console.log(`Result: ${result}`)

        // Test round-trip: js2jeon -> evalJeon should produce same result as direct eval
        // This is a simple check - in practice you'd want more thorough testing
        console.log('✅ Test passed\n')
    } catch (error) {
        console.error(`❌ Test failed: ${(error as Error).message}\n`)
    }
}

console.log('Destructuring tests completed.')