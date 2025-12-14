import { js2jeon } from './src/js2jeon'
import { evalJeon } from './src/safeEval'

// Test case34 specifically
const code = `
function(...a) { return a }
`

console.log('Debugging case34...')
console.log('Code:')
console.log(code)

try {
    const jeon = js2jeon(code, { iife: true })
    console.log('\nGenerated JEON:')
    console.log(JSON.stringify(jeon, null, 2))

    const result = evalJeon(jeon)
    console.log('\nResult:', result)
    console.log('Type of result:', typeof result)
    console.log('Expected: undefined')

    if (result === undefined) {
        console.log('✅ SUCCESS: Result is undefined as expected')
    } else {
        console.log('❌ FAILURE: Expected undefined, got', result)
    }
} catch (error: any) {
    console.error('❌ ERROR:', error.message)
    console.error(error.stack)
}