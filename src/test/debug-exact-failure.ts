import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Debug Exact Failure ===\n')

// Test the exact failing case - the full program with multiple statements
const fullProgramCode = `function* countUpTo(max) {
  let i = 1;
  while (i <= max) {
    yield i++;
  }
}
const counter = countUpTo(3);
[counter.next().value, counter.next().value, counter.next().value]`

console.log('Full program code:')
console.log(fullProgramCode)

try {
    const jeon = js2jeon(fullProgramCode)
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