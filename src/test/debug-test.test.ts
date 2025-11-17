import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'

console.log('=== Debug Test ===')

// Test simple variable declarations
const code = `function test() {let d;const f = 22;var g;}`

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