import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Debug Array Context ===\n')

// Test a simple generator function in isolation
const simpleGeneratorCode = `function* countUpTo(max) {
  yield 1;
  yield 2;
  return max;
}`

console.log('Simple generator function:')
console.log(simpleGeneratorCode)

try {
    const jeon = js2jeon(simpleGeneratorCode)
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

console.log('\n---\n')

// Test the complex generator that's failing
const complexGeneratorCode = `function* countUpTo(max) {
  let i = 1;
  while (i <= max) {
    yield i++;
  }
}`

console.log('Complex generator function:')
console.log(complexGeneratorCode)

try {
    const jeon = js2jeon(complexGeneratorCode)
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