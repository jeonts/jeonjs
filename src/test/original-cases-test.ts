import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Original Cases Test ===\n')

// Test the specific cases mentioned in the original query
const originalCases = [
    {
        name: 'Case 14: Empty object literal',
        code: '{}'
    },
    {
        name: 'Case 15: Simple object literal',
        code: '{a:1, b:2}'
    },
    {
        name: 'Case 13: Array with spread',
        code: '[1, 2, ...[3, 4], 5]'
    },
    {
        name: 'Function declaration and call',
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
    }
]

let passed = 0
for (const testCase of originalCases) {
    console.log(`\n--- Testing: ${testCase.name} ---`)
    try {
        const jeon = js2jeon(testCase.code, { iife: true })
        const result = evalJeon(jeon)
        console.log('✅ SUCCESS')
        console.log('Result:', result)
        passed++
    } catch (error: any) {
        console.log('❌ FAILED')
        console.log('Error:', error.message)
    }
}

console.log(`\n\n=== FINAL RESULTS ===`)
console.log(`Passed: ${passed}/${originalCases.length}`)
if (passed === originalCases.length) {
    console.log('🎉 ALL ORIGINAL CASES ARE NOW WORKING!')
} else {
    console.log('Some cases still need work.')
}