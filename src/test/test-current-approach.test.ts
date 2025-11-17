import { js2jeon } from '../js2jeon'

console.log('=== Testing Current Approach ===')

// Test with uninitialized variables
const code = 'let d; const f = 22; var g;'

console.log('Original code:')
console.log(code)

try {
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

    // Test parsing it back
    const parsed = JSON.parse(jeonString)
    console.log('\nParsed back:')
    console.log(JSON.stringify(parsed, null, 2))

    // Check if we can detect uninitialized variables
    if (parsed[0]['@'] && parsed[0]['@']['d'] === '@undefined' && parsed[2]['@'] && parsed[2]['@']['g'] === '@undefined') {
        console.log('✅ Can detect uninitialized variables with sentinel value')
    } else {
        console.log('❌ Cannot detect uninitialized variables')
    }

} catch (e: any) {
    console.log('Error:', e.message)
    console.log(e.stack)
}