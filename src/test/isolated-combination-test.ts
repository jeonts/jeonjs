import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Isolated Combination Test ===\n')

// Test the specific issue: method call on an object
console.log('Test: Method call on an object')
const testCode = `
function greet(name) {
  return "Hello, " + name;
}

class Greeter {
  constructor(prefix) {
    this.prefix = prefix;
  }
  
  greet(name) {
    return this.prefix + " " + name;
  }
}

const greeter = new Greeter(greet("Dear"));
greeter.greet("World");
`

try {
    console.log('Code:', testCode)
    const jeon = js2jeon(testCode)
    console.log('JEON:', JSON.stringify(jeon, null, 2))
    const result = evalJeon(jeon)
    console.log('Result:', result)
    console.log('✓ Method call test passed\n')
} catch (error: any) {
    console.error('✗ Method call test failed:', error.message)
    console.error('Stack:', error.stack)
    console.log('')
}