import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Complete Flow Test ===\n')

try {
    // Test the complete flow that was failing
    const code = `class Person {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return "Hello, " + this.name;
  }
}
const p = new Person("Alice");
p.greet();`

    console.log('JavaScript code:')
    console.log(code)

    // Convert to JEON
    console.log('\nConverting to JEON...')
    const jeon = js2jeon(code)
    console.log('JEON representation:')
    console.log(JSON.stringify(jeon, null, 2))

    // Try to evaluate with current evalJeon
    console.log('\nAttempting to evaluate with evalJeon...')
    const result = evalJeon(jeon)
    console.log('Final result:', result)

} catch (error: any) {
    console.error('Error:', error.message)
    console.error(error.stack)
}