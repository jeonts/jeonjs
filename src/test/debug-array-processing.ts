import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Debug Array Processing ===\n')

// Let's test an array with just the generator function
const arrayWithGeneratorCode = `function* countUpTo(max) {
  let i = 1;
  while (i <= max) {
    yield i++;
  }
}`

console.log('Array with generator function:')
console.log(arrayWithGeneratorCode)

try {
    const jeon = js2jeon(arrayWithGeneratorCode)
    console.log('JEON:', JSON.stringify(jeon, null, 2))

    // Create a context to hold the function
    const context: any = {}
    const result = evalJeon([jeon], context)  // Wrap in array to trigger array processing
    console.log('Result:', result)
    console.log('Context keys:', Object.keys(context))
} catch (error: any) {
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
}