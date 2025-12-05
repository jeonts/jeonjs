import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Simple Class Test ===\n')

// Test class declaration and instantiation
const classCode = `
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
    console.log('Code:', classCode)
    const jeon = js2jeon(classCode)
    console.log('JEON:', JSON.stringify(jeon, null, 2))
    const result = evalJeon(jeon)
    console.log('Result:', result)
    console.log('Greet method result:', result.greet())
    console.log('✓ Class test passed\n')
} catch (error: any) {
    console.error('✗ Class test failed:', error.message)
    console.error('Stack:', error.stack)
    console.log('')
}