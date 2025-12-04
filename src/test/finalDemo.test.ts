// Final demo test showing the exact use case from the request
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { evalJeon } from '../safeEval'

console.log('=== Final Demo: JS to JEON to JS to Eval ===\n')

// The exact example from the request
const originalCode = `(function a(name) { 
  return 'Hello, ' + name; 
}, a('world'))`

console.log('Original JavaScript:')
console.log(originalCode)
console.log('')

try {
    // Step 1: Convert JavaScript to JEON
    const jeon = js2jeon(originalCode)
    console.log('Step 1: JavaScript → JEON')
    console.log(JSON.stringify(jeon, null, 2))
    console.log('')

    // Step 2: Convert JEON back to JavaScript
    const regeneratedJs = jeon2js(jeon)
    console.log('Step 2: JEON → JavaScript')
    console.log(regeneratedJs)
    console.log('')

    // Step 3: Evaluate the JEON
    console.log('Step 3: Evaluate JEON')
    const result = evalJeon(jeon)
    console.log('Result:', result)
    console.log('')

    // Verification
    console.log('=== Verification ===')
    console.log('Expected: "Hello, world"')
    console.log('Actual:', JSON.stringify(result))
    console.log(result === 'Hello, world' ? '✅ SUCCESS: Implementation works correctly!' : '❌ FAILURE: Results do not match')

} catch (error: any) {
    console.log('❌ ERROR:', error.message)
    console.log(error.stack)
}

console.log('\n=== Demo Completed ===')