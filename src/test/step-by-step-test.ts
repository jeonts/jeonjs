import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Step-by-Step Test ===\n')

try {
    // Let's test each part separately

    // 1. Test just the class declaration
    console.log('--- 1. Testing class declaration alone ---')
    const classCode = `class Person {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return "Hello, " + this.name;
  }
}`

    const classJeon = js2jeon(classCode)
    console.log('Class JEON:', JSON.stringify(classJeon, null, 2))

    const ClassConstructor = evalJeon(classJeon)
    console.log('Class constructor result:', typeof ClassConstructor)

    // 2. Test instantiation
    if (typeof ClassConstructor === 'function') {
        const instance = new ClassConstructor('Alice')
        console.log('Instance name:', instance.name)
        console.log('Greeting:', instance.greet())
    }

    // 3. Test the full sequence
    console.log('\n--- 2. Testing full sequence ---')
    const fullCode = `class Person {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return "Hello, " + this.name;
  }
}
const p = new Person("Alice");
p.greet();`

    const fullJeon = js2jeon(fullCode)
    console.log('Full JEON:', JSON.stringify(fullJeon, null, 2))

    console.log('\nEvaluating full sequence...')
    const fullResult = evalJeon(fullJeon)
    console.log('Full result:', fullResult)

} catch (error: any) {
    console.error('Error:', error.message)
    console.error(error.stack)
}