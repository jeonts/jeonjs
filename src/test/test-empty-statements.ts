import { js2jeon, jeon2js } from '../index'

console.log('=== Testing Empty Statements ===')

// Test with empty statements
const code = 'function test() { ; ; return 42; }'

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