import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Testing evalJeon Upgrade ===\n')

// Test various JavaScript constructs that js2jeon can produce
const testCases = [
    {
        name: 'Simple expression',
        code: '1 + 2'
    },
    {
        name: 'Variable assignment',
        code: 'let x = 42; x'
    },
    {
        name: 'Function declaration',
        code: 'function add(a, b) { return a + b; } add(1, 2)'
    },
    {
        name: 'Class declaration',
        code: `class Person {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return "Hello, " + this.name;
  }
}
const p = new Person("Alice");
p.greet();`
    },
    {
        name: 'Array literal',
        code: '[1, 2, 3]'
    },
    {
        name: 'Object literal',
        code: '({ a: 1, b: 2 })'
    }
]

try {
    testCases.forEach((testCase, index) => {
        console.log(`\n--- Test Case ${index + 1}: ${testCase.name} ---`)
        console.log('JavaScript code:')
        console.log(testCase.code)

        // Convert to JEON
        console.log('\nConverting to JEON...')
        const jeon = js2jeon(testCase.code)
        console.log('JEON representation:')
        console.log(JSON.stringify(jeon, null, 2))

        // Try to evaluate with current evalJeon
        console.log('\nAttempting to evaluate with evalJeon...')
        try {
            const result = evalJeon(jeon)
            console.log('Result:', result)
        } catch (error: any) {
            console.error('Error:', error.message)
        }
    })

    console.log('\n=== Test completed ===')

} catch (error: any) {
    console.error('Error:', error.message)
    console.error(error.stack)
}