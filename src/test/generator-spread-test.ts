import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

// Test the generator function with spread operator from the user's second query
const generatorCode = `
function* countUpTo(max) {
  yield 1;
  yield 2;
  return max;
}
[...countUpTo(10)]
`

console.log('Original code:')
console.log(generatorCode)

try {
    // Convert to JEON
    const jeon = js2jeon(generatorCode)
    console.log('\nJEON representation:')
    console.log(JSON.stringify(jeon, null, 2))

    // Evaluate the JEON
    const result = evalJeon(jeon)
    console.log('\nResult of evalJeon:')
    console.log(result)
    console.log('Type of result:', typeof result)
    console.log('Result as array:', Array.isArray(result) ? result : 'Not an array')

    if (Array.isArray(result)) {
        console.log('Array contents:', result)
    }
} catch (error: any) {
    console.error('Error:', error.message)
    console.error(error.stack)
}