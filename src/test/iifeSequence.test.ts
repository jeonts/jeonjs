// Test for IIFE with SequenceExpression handling
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { evalJeon } from '../safeEval'

console.log('=== Testing IIFE with SequenceExpression ===\n')

// Test the specific case mentioned in the request
const iifeCode = `(function a(name) { 
  return 'Hello, ' + name; 
}, a('world'))`

console.log('Original JavaScript:')
console.log(iifeCode)

try {
    // Convert JS to JEON
    const jeon = js2jeon(iifeCode)
    console.log('\nJEON representation:')
    console.log(JSON.stringify(jeon, null, 2))

    // Convert JEON back to JS
    const regeneratedJs = jeon2js(jeon)
    console.log('\nRegenerated JavaScript:')
    console.log(regeneratedJs)

    // Evaluate the JEON
    console.log('\nEvaluating JEON:')
    const result = evalJeon(jeon)
    console.log('Result:', result)

} catch (error: any) {
    console.log('Error:', error.message)
    console.log(error.stack)
}

console.log('\n=== Test Completed ===')