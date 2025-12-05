import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Final Summary Test ===\n')

// Test cases that should work with the iife option
const workingCases = [
  {
    name: 'Empty object literal',
    code: '{}'
  },
  {
    name: 'Simple object literal',
    code: '{a:1}'
  },
  {
    name: 'Complex object literal',
    code: '{a:1, b:2}'
  },
  {
    name: 'Array literal',
    code: '[1, 2, 3]'
  },
  {
    name: 'Array with spread',
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
  },
  {
    name: 'Arrow function',
    code: '((x) => { return (x * 2); })(10)'
  }
]

// Test cases that still have issues
const problematicCases = [
  {
    name: 'Object destructuring',
    code: `
      const obj = { a: 1, b: 2 };
      const { a, b } = obj;
      a + b
    `,
    issue: 'Destructuring not properly handled in context assignment'
  },
  {
    name: 'Complex objects with built-in types',
    code: `
      return {
        date: new Date("2025-01-01T00:00:00.000Z"),
        regexp: /hello world/gi,
      }
    `,
    issue: 'Built-in constructors not properly handled in evalJeon'
  },
  {
    name: 'Objects with getters',
    code: `
      const obj = {
        get name() {
          return 'test';
        }
      };
      obj.name
    `,
    issue: 'Getter functions not properly evaluated'
  }
]

console.log('=== WORKING CASES ===')
let workingCount = 0
for (const testCase of workingCases) {
  console.log(`\n--- Testing: ${testCase.name} ---`)
  try {
    const jeon = js2jeon(testCase.code, { iife: true })
    const result = evalJeon(jeon)
    console.log('✅ SUCCESS')
    console.log('Result:', result)
    workingCount++
  } catch (error: any) {
    console.log('❌ FAILED')
    console.log('Error:', error.message)
  }
}

console.log('\n\n=== PROBLEMATIC CASES ===')
let problemCount = 0
for (const testCase of problematicCases) {
  console.log(`\n--- Testing: ${testCase.name} ---`)
  console.log(`Known issue: ${testCase.issue}`)
  try {
    const jeon = js2jeon(testCase.code, { iife: true })
    const result = evalJeon(jeon)
    console.log('✅ SUCCESS (unexpected!)')
    console.log('Result:', result)
    problemCount++
  } catch (error: any) {
    console.log('❌ FAILED (as expected)')
    console.log('Error:', error.message)
  }
}

console.log(`\n\n=== SUMMARY ===`)
console.log(`Working cases: ${workingCount}/${workingCases.length}`)
console.log(`Problematic cases resolved: ${problemCount}/${problematicCases.length}`)
console.log(`Total progress: ${workingCount + problemCount}/${workingCases.length + problematicCases.length}`)