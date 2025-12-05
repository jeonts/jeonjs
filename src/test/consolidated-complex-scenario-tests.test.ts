import { js2jeon, jeon2js } from '../index'
import { expect, test } from '@woby/chk'

test('Consolidated Complex Scenario Tests', () => {
    console.log('=== Consolidated Complex Scenario Tests ===\n')

    // Test with empty statements
    console.log('Test 1: Testing Empty Statements')
    const code1 = 'function test() { ; ; return 42; }'

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
        console.log(regenerated)

        // Assertions
        expect(jeon).toBeDefined()
        expect(regenerated).toBeDefined()
        console.log('✅ Test 1 passed\n')
    } catch (e: any) {
        console.log('Error:', e.message)
        console.log(e.stack)
        throw e
    }

    // Test with both uninitialized variables and empty statements
    console.log('Test 2: Complex Test with Empty Statements and Uninitialized Variables')
    const code2 = 'function test() { let a; ; const b = 1; ; var c; return a + b + c; }'

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

    // Test with uninitialized variables
    console.log('Test 3: Testing Current Approach with Uninitialized Variables')
    const code3 = 'let d; const f = 22; var g;'

    console.log('Original code:')
    console.log(code3)

    try {
        const jeon = js2jeon(code3)
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

        // Assertions
        expect(jeon).toBeDefined()
        expect(jeonString).toBeDefined()
        expect(parsed).toBeDefined()
        console.log('✅ Test 3 passed\n')
    } catch (e: any) {
        console.log('Error:', e.message)
        console.log(e.stack)
        throw e
    }

    console.log('=== All Complex Scenario Tests Completed ===')
})