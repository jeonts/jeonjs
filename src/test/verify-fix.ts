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
    const jeonString = JSON.stringify(jeon)
    if (jeonString.includes('"@":{}') && jeonString.includes('"@@":{"f":22}')) {
        console.log('\n✅ JEON structure is correct')
    } else {
        console.log('\n❌ JEON structure is incorrect')
    }

    // Verify the regenerated code is correct
    if (regenerated.includes('let d;') && regenerated.includes('const f = 22;') && regenerated.includes('let g')) {
        console.log('✅ Regenerated code is correct')
    } else {
        console.log('❌ Regenerated code is incorrect')
    }

} catch (e: any) {
    console.log('Error:', e.message)
    console.log(e.stack)
}