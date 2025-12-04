import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'

console.log('=== Verification Test ===')

// Test the specific case: uninitialized variable declarations
const code = 'function test() {let d;const f = 22;var g;}'

console.log('Original code:')
console.log(code)

try {
    // Convert JS to JEON
    const jeon = js2jeon(code)
    console.log('\nJEON output:')
    console.log(JSON.stringify(jeon, null, 2))

    // Convert JEON back to JS
    const regenerated = jeon2js(jeon)
    console.log('\nRegenerated code:')
    console.log(regenerated)

    // Verify the JEON structure is correct
    // Check that uninitialized variables have the "@undefined" sentinel value
    const jeonString = JSON.stringify(jeon)
    if (jeonString.includes('"d":"@undefined"') &&
        jeonString.includes('"@@":{"f":22}') &&
        jeonString.includes('"g":"@undefined"')) {
        console.log('\n✅ JEON structure is correct')
    } else {
        console.log('\n❌ JEON structure is incorrect')
        console.log('Expected to find "@undefined" sentinel values for uninitialized variables')
    }

    // Verify the regenerated code is correct
    // Check for the presence of variable declarations with proper formatting
    if (regenerated.includes('let d') &&
        regenerated.includes('const f = 22') &&
        regenerated.includes('let g') &&
        regenerated.includes('function test()')) {
        console.log('✅ Regenerated code is correct')
    } else {
        console.log('❌ Regenerated code is incorrect')
        console.log('Expected to find properly formatted variable declarations')
    }

} catch (e: any) {
    console.log('Error:', e.message)
    console.log(e.stack)
}