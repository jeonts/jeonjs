import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Debug Class Test ===\n')

try {
    // Simple class test
    const classCode = `class Person {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return "Hello, " + this.name;
  }
}`

    console.log('JavaScript code:')
    console.log(classCode)

    // Convert to JEON
    console.log('\nConverting to JEON...')
    const jeon = js2jeon(classCode)
    console.log('JEON representation:')
    console.log(JSON.stringify(jeon, null, 2))

    // Try to evaluate with current evalJeon
    console.log('\nAttempting to evaluate with evalJeon...')
    const context: any = {}
    const classResult = evalJeon(jeon, context)
    console.log('Class result:', classResult)
    console.log('Type of result:', typeof classResult)
    console.log('Context keys:', Object.keys(context))

    // Try to instantiate the class
    if (typeof context.Person === 'function') {
        console.log('\nTrying to create an instance...')
        const instance = new context.Person('Alice')
        console.log('Instance created:', instance)
        console.log('Instance name:', instance.name)

        console.log('\nTrying to call greet method...')
        const greeting = instance.greet()
        console.log('Greeting:', greeting)
    }

    console.log('\n=== Test completed ===')

} catch (error: any) {
    console.error('❌ Error:', error.message)
    console.error('Stack:', error.stack)
}