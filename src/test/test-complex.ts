import { js2jeon, jeon2js } from '../index'

console.log('=== Complex Test with Empty Statements and Uninitialized Variables ===')

// Test with both uninitialized variables and empty statements
const code = 'function test() { let a; ; const b = 1; ; var c; return a + b + c; }'

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

} catch (e: any) {
    console.log('Error:', e.message)
    console.log(e.stack)
}