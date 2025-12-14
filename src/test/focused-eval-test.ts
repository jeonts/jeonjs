import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Focused evalJeon(js2jeon()) Test ===\n')

// Test cases that should definitely work
const testCases = [
    {
        name: 'Simple function declaration and call',
        code: `
      function a(name) { return ("Hello, " + name) }
      a('world')
    `
    },
    {
        name: 'Generator function with spread',
        code: `
      function* countUpTo(max) {
        yield 1;
        yield 2;
        return max;
      }
      [...countUpTo(10)]
    `
    },
    {
        name: 'Class declaration and instantiation',
        code: `
      class Person {
        constructor(name) {
          this.name = name
        };
        greet() {
          return ("Hello, " + this.name)
        }
      }
      new Person('Alex')
    `
    },
    {
        name: 'Class method call',
        code: `
      class Person {
        constructor(name) {
          this.name = name
        };
        greet() {
          return ("Hello, " + this.name)
        }
      }
      new Person('Alex').greet()
    `
    },
    {
        name: 'Arrow function',
        code: `
      ((x) => { return (x * 2); })(10)
    `
    },
    {
        name: 'Simple object',
        code: `
      ({a:1, b:2})
    `
    },
    {
        name: 'Array with spread',
        code: `
      [1, 2, ...[3, 4], 5]
    `
    }
]

// Helper function to test a case
function testCase(caseName: string, code: string) {
    console.log(`--- Testing ${caseName} ---`)
    console.log('Code:')
    console.log(code)

    try {
        const jeon = js2jeon(code, { iife: true })
        console.log('JEON:')
        console.log(JSON.stringify(jeon, null, 2))

        const result = evalJeon(jeon)
        console.log('Result:')
        console.log(result)
        console.log('✅ Success\n')
        return true
    } catch (error: any) {
        console.error('❌ Error:', error.message)
        console.log('')
        return false
    }
}

// Track results
let passed = 0
let total = 0

// Run all tests
for (const testCaseObj of testCases) {
    total++
    if (testCase(testCaseObj.name, testCaseObj.code)) {
        passed++
    }
}

console.log(`=== Test Results: ${passed}/${total} passed ===`)