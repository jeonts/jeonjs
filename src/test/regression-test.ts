import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

// Test cases that should still work after our changes
const testCases = [
    {
        name: 'Basic function call',
        code: `function a(name) { return ("Hello, " + name) } a('world')`
    },
    {
        name: 'Arrow function',
        code: `((x) => { return (x * 2); })(10)`
    },
    {
        name: 'Object literal',
        code: `{a:1, b:2}`
    },
    {
        name: 'Array with spread',
        code: `[1, 2, ...[3, 4], 5]`
    },
    {
        name: 'Simple assignment',
        code: `let count = 0; let message = "Hello World"; message`
    },
    {
        name: 'Property access',
        code: `const obj = {a:1, b:3, 3:5}; obj['a'] + obj.b + obj[3]`
    }
]

// Test each case
function runTests() {
    for (const { name, code } of testCases) {
        try {
            console.log(`\n=== Testing ${name} ===`)
            console.log('Code:', code)

            const jeon = js2jeon(code, { iife: true })
            console.log('JEON:', JSON.stringify(jeon, null, 2))

            const result = evalJeon(jeon)
            console.log('Result:', result)
            console.log('✅ PASSED')
        } catch (error: any) {
            console.error('❌ FAILED:', error.message)
            console.error(error.stack)
        }
    }
}

runTests()