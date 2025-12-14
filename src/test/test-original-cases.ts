import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

// Test the original cases from the _.ts file
const case37 = `
const {a,b, ...rest} = {a:1, b:3}
a+b
`

const case38 = `
const [head, a,b, ...rest] = [1, 2, 3, 4, 5]
a+b
`

const case39 = `
const [x, y, z] = [1, 2, 3]
x + y + z
`

const case40 = `
const [a, , b] = [1, 2, 3]
a + b
`

const case41 = `
const [first, ...rest] = [1, 2, 3, 4, 5]
first + rest.length
`

const testCases = [
    { name: 'case37 - Object destructuring with rest', code: case37 },
    { name: 'case38 - Array destructuring with rest', code: case38 },
    { name: 'case39 - Simple array destructuring', code: case39 },
    { name: 'case40 - Array destructuring with holes', code: case40 },
    { name: 'case41 - Array destructuring with rest element', code: case41 }
]

console.log('Testing original cases...\n')

for (const testCase of testCases) {
    try {
        console.log(`Testing: ${testCase.name}`)

        // Convert JS to JEON
        const jeon = js2jeon(testCase.code)
        console.log(`JEON:`, JSON.stringify(jeon, null, 2))

        // Evaluate JEON
        const result = evalJeon(jeon)
        console.log(`Result: ${result}`)

        console.log('✅ Test passed\n')
    } catch (error) {
        console.error(`❌ Test failed: ${(error as Error).message}\n`)
    }
}