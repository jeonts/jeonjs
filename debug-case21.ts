import { js2jeon } from './src/js2jeon'
import { evalJeon } from './src/safeEval'

// Test case21 specifically
const code = `
(function (a){return a+1})(10)
`

console.log('Debugging case21...')
console.log('Code:')
console.log(code)

try {
    const jeon = js2jeon(code, { iife: true })
    console.log('\nGenerated JEON:')
    console.log(JSON.stringify(jeon, null, 2))

    const result = evalJeon(jeon)
    console.log('\nResult:', result)
    console.log('Expected: 11')

    if (result === 11) {
        console.log('✅ SUCCESS: Result is 11 as expected')
    } else {
        console.log('❌ FAILURE: Expected 11, got', result)
    }
} catch (error: any) {
    console.error('❌ ERROR:', error.message)
    console.error(error.stack)
}