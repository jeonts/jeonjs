import { js2jeon, jeon2js } from '../index'

console.log('=== Debug Regeneration ===')

// Test with empty statements
const code = 'function test() { ; }'

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
    console.log(JSON.stringify(regenerated))
    console.log('Actual output:')
    console.log(regenerated)

    // Let's also test what happens with just the function body
    if (jeon && typeof jeon === 'object' && Object.keys(jeon).length === 1) {
        const funcKey = Object.keys(jeon)[0]
        const funcBody = jeon[funcKey]
        console.log('\nFunction body:')
        console.log(JSON.stringify(funcBody, null, 2))

        // Test converting just the function body
        const bodyJs = jeon2js(funcBody)
        console.log('\nFunction body as JS:')
        console.log(JSON.stringify(bodyJs))
        console.log('Actual body output:')
        console.log(bodyJs)
    }

} catch (e: any) {
    console.log('Error:', e.message)
    console.log(e.stack)
}