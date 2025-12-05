import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Final User Tests ===\n')

// Test 1: Regular function
console.log('Test 1: Regular function')
const test1Code = `
function a(name) { return ("Hello, " + name) }
a('world')
`

try {
    console.log('Code:', test1Code)
    const jeon1 = js2jeon(test1Code)
    console.log('JEON:', JSON.stringify(jeon1, null, 2))
    const result1 = evalJeon(jeon1)
    console.log('Result:', result1)
    console.log('✓ Test 1 passed\n')
} catch (error: any) {
    console.error('✗ Test 1 failed:', error.message)
    console.log('')
}

// Test 2: Generator function with spread
console.log('Test 2: Generator function with spread')
const test2Code = `
function* countUpTo(max) {
  yield 1;
  yield 2;
  return max;
}
[...countUpTo(10)]
`

try {
    console.log('Code:', test2Code)
    const jeon2 = js2jeon(test2Code)
    console.log('JEON:', JSON.stringify(jeon2, null, 2))
    const result2 = evalJeon(jeon2)
    console.log('Result:', result2)
    console.log('✓ Test 2 passed\n')
} catch (error: any) {
    console.error('✗ Test 2 failed:', error.message)
    console.log('')
}

// Test 3: Class declaration and instantiation
console.log('Test 3: Class declaration and instantiation')
const test3Code = `
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

try {
    console.log('Code:', test3Code)
    const jeon3 = js2jeon(test3Code)
    console.log('JEON:', JSON.stringify(jeon3, null, 2))
    const result3 = evalJeon(jeon3)
    console.log('Result:', result3)
    console.log('Greet method result:', result3.greet())
    console.log('✓ Test 3 passed\n')
} catch (error: any) {
    console.error('✗ Test 3 failed:', error.message)
    console.log('')
}

console.log('=== All user tests completed ===')