import { js2jeon, jeon2js } from '../index'

console.log('=== Round-trip Test ===')

// Test the specific case
const code = 'function sum(a, b) {let d;const f = 22;var g; return a + b;}'

console.log('Original code:')
console.log(code)

try {
    // Convert JS to JEON
    const jeon = js2jeon(code)
    console.log('\nJEON output:')
    console.log(JSON.stringify(jeon, null, 2))

    // Check what we get
    const jeonString = JSON.stringify(jeon)
    console.log('\nJEON string representation:')
    console.log(jeonString)

    if (jeonString.includes('"d"') && jeonString.includes('"g"')) {
        console.log('✅ Variable names are preserved in JEON')
    } else {
        console.log('❌ Variable names are NOT preserved in JEON')
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
        console.log('Expected to find: let d;, const f = 22;, let g;')
        console.log('Actual:', regenerated)
    }

    if (jeonString.includes('"d"') && jeonString.includes('"g"')) {
        console.log('\n✅ Round-trip test PASSED')
    } else {
        console.log('\n❌ Round-trip test FAILED - variable names not preserved')
    }

} catch (e: any) {
    console.log('Error:', e.message)
    console.log(e.stack)
}