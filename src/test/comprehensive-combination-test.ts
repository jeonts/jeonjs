import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Comprehensive Combination Test ===\n')

// Test 1: Regular function declaration and call
console.log('Test 1: Regular function declaration and call')
const test1Code = `
function a(name) { 
  return ("Hello, " + name) 
}

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
    console.error('Stack:', error.stack)
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
    console.error('Stack:', error.stack)
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
    console.error('Stack:', error.stack)
    console.log('')
}

// Test 4: Complex combination - function, generator, and class
console.log('Test 4: Complex combination')
const test4Code = `
function greet(name) {
  return "Hello, " + name;
}

function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

class Greeter {
  constructor(prefix) {
    this.prefix = prefix;
  }
  
  greet(name) {
    return this.prefix + " " + name;
  }
}

// Use all of them together
const greeter = new Greeter(greet("Dear"));
const numbers = [...numberGenerator()];
const message = greeter.greet("World");

{ message, numbers }
`

try {
    console.log('Code:', test4Code)
    const jeon4 = js2jeon(test4Code)
    console.log('JEON:', JSON.stringify(jeon4, null, 2))
    const result4 = evalJeon(jeon4)
    console.log('Result:', result4)
    console.log('✓ Test 4 passed\n')
} catch (error: any) {
    console.error('✗ Test 4 failed:', error.message)
    console.error('Stack:', error.stack)
    console.log('')
}

console.log('=== All tests completed ===')