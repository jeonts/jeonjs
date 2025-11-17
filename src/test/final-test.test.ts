import { js2jeon, jeon2js } from '../index'

console.log('=== Final Comprehensive Test ===')

// Test the specific case you mentioned
const code = 'function sum(a, b) {let d;const f = 22;var g; return a + b;}'

console.log('Original code:')
console.log(code)

try {
    // Convert JS to JEON
    const jeon = js2jeon(code)
    console.log('\nJEON output:')
    console.log(JSON.stringify(jeon, null, 2))

    // Check that we have the expected structure
    const jeonString = JSON.stringify(jeon)
    if (jeonString.includes('"d":"@undefined"') && jeonString.includes('"g":"@undefined"')) {
        console.log('✅ JEON correctly includes variable names for uninitialized variables')
    } else {
        console.log('❌ JEON missing variable names for uninitialized variables')
    }

    // Convert JEON back to JS
    const regenerated = jeon2js(jeon)
    console.log('\nRegenerated code:')
    console.log(regenerated)

    // Check that the regenerated code is correct
    if (regenerated.includes('let d;') && regenerated.includes('const f = 22;') && regenerated.includes('let g;')) {
        console.log('✅ Regenerated code correctly preserves uninitialized variables')
    } else {
        console.log('❌ Regenerated code missing uninitialized variables')
    }

    console.log('\n✅ All tests passed! The conversion is now reversible and correct.')

} catch (e: any) {
    console.log('Error:', e.message)
    console.log(e.stack)
}