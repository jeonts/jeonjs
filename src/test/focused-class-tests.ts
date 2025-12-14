import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

// Test cases that were previously failing
const testCases = [
  {
    name: 'case25 - Anonymous class expression instantiation',
    code: `new (class Person { constructor(name) { this.name = name }; greet() { return ('Hello, ' + this.name) } })('Ali')`
  },
  {
    name: 'case26 - Anonymous class expression method call',
    code: `new (class Person { constructor(name) { this.name = name }; greet() { return ('Hello, ' + this.name) } })('Mary').greet()`
  },
  {
    name: 'case28 - Anonymous class without name',
    code: `new (class { constructor(name) { this.name = name }; greet() { return ('Hello, ' + this.name) } })('Danial')`
  },
  {
    name: 'case29 - Anonymous class without name method call',
    code: `new (class { constructor(name) { this.name = name }; greet() { return ('Hello, ' + this.name) } })('John').greet()`
  },
  {
    name: 'case23 - Named class declaration and instantiation',
    code: `class Person { constructor(name) { this.name = name }; greet() { return ('Hello, ' + this.name) } } new Person('Alex')`
  },
  {
    name: 'case24 - Named class declaration and method call',
    code: `class Person { constructor(name) { this.name = name }; greet() { return ('Hello, ' + this.name) } } new Person('Alex').greet()`
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