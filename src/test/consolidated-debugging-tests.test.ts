import { js2jeon, jeon2js } from '../index'
import { expect, test } from '@woby/chk'

test('Consolidated Debugging and Regeneration Tests', () => {
    console.log('=== Consolidated Debugging and Regeneration Tests ===\n')

    // Test with empty statements
    const code1 = 'function test() { ; }'

    console.log('Test 1: Debug regeneration with empty statements')
    console.log('Original code:')
    console.log(code1)

    try {
        // Convert JS to JEON
        const jeon = js2jeon(code1)
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

        // Assertions
        expect(jeon).toBeDefined()
        expect(regenerated).toBeDefined()
        console.log('✅ Test 1 passed\n')
    } catch (e: any) {
        console.log('Error:', e.message)
        console.log(e.stack)
        throw e
    }

    // Test simple variable declarations
    const code2 = `function test() {let d;const f = 22;var g;}`

    console.log('Test 2: Debug test with variable declarations')
    console.log('Original code:')
    console.log(code2)

    try {
        // Convert JS to JEON
        const jeon = js2jeon(code2)
        console.log('\nJEON output:')
        console.log(JSON.stringify(jeon, null, 2))

        // Convert JEON back to JS
        const regenerated = jeon2js(jeon)
        console.log('\nRegenerated code:')
        console.log(regenerated)

        // Assertions
        expect(jeon).toBeDefined()
        expect(regenerated).toBeDefined()
        console.log('✅ Test 2 passed\n')
    } catch (e: any) {
        console.log('Error:', e.message)
        console.log(e.stack)
        throw e
    }

    // Test with semicolons like in the web UI
    const code3 = `function sum(a, b) {let d;const f = 22;var g;  return a + b;};function min(a, b){return Math.min(a,b)};function main(a, b){return min(sum(a,b))}`

    console.log('Test 3: Debug test with semicolons (web UI format)')
    console.log('Original code:')
    console.log(code3)

    try {
        // Convert JS to JEON
        const jeon = js2jeon(code3)
        console.log('\nJEON output:')
        console.log(JSON.stringify(jeon, null, 2))

        // Convert JEON back to JS
        const regenerated = jeon2js(jeon)
        console.log('\nRegenerated code:')
        console.log(regenerated)

        // Assertions
        expect(jeon).toBeDefined()
        expect(regenerated).toBeDefined()
        console.log('✅ Test 3 passed\n')
    } catch (e: any) {
        console.log('Error:', e.message)
        console.log(e.stack)
        throw e
    }

    console.log('=== All Debugging Tests Completed ===')
})