import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Debug Step by Step ===\n')

// Let's test just the generator function definition
const justGeneratorCode = `function* countUpTo(max) {
  let i = 1;
  while (i <= max) {
    yield i++;
  }
}`

console.log('Just generator function definition:')
console.log(justGeneratorCode)

try {
    const jeon = js2jeon(justGeneratorCode)
    console.log('JEON:', JSON.stringify(jeon, null, 2))
    
    // Create a context to hold the function
    const context: any = {}
    const result = evalJeon(jeon, context)
    console.log('Result:', result)
    console.log('Context keys:', Object.keys(context))
} catch (error: any) {
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
}