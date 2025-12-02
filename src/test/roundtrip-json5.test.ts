import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import JSON5 from '@mainnet-pat/json5-bigint'

console.log('=== Round Trip Test with JSON5 ===\n')

// Test the simple object
const jsCode = 'const item = { foo: 1 };'

console.log('Original JavaScript:')
console.log(jsCode)

// Convert JS to JEON
console.log('\n--- Converting JS to JEON ---')
try {
    const jeonResult = js2jeon(jsCode, { json: JSON5 })
    console.log('JEON Output:')
    console.log(JSON.stringify(jeonResult, null, 2))

    // Convert JEON back to JS with JSON5
    console.log('\n--- Converting JEON back to JS with JSON5 ---')
    const jsResult = jeon2js(jeonResult, { json: JSON5 })
    console.log('Generated JavaScript:')
    console.log(jsResult)

    // Verify the structure
    console.log('\n--- Verification ---')
    console.log('Original JS:  ', jsCode)
    console.log('Generated JS: ', jsResult)
    console.log('Match:', jsCode === jsResult)
} catch (error: any) {
    console.log('Error:', error.message)
    console.log('Stack:', error.stack)
}