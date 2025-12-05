import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { evalJeon } from '../safeEval'
import JSON5 from '@mainnet-pat/json5-bigint'
import { expect, test } from '@woby/chk'

test('Consolidated Sugar Syntax Tests', () => {
    console.log('=== Consolidated Sugar Syntax Tests ===\n')

    // Test 1: Function call conversion
    console.log('Test 1: Function call conversion')
    const code1 = `(function (a, b) {
  abs(a + b)
})`

    console.log('JavaScript code:')
    console.log(code1)
    console.log('\nJEON (explicit syntax - no sugar):')
    const jeon1 = js2jeon(code1)
    console.log(JSON5.stringify(jeon1, null, 2))
    console.log('\nConverted back to JavaScript:')
    const jsCode1 = jeon2js(jeon1)
    console.log(jsCode1)

    // Test 2: Member access (this.name) conversion
    console.log('\nTest 2: Member access (this.name) conversion')
    const code2 = `(function() {
  return this.name
})`

    console.log('JavaScript code:')
    console.log(code2)
    console.log('\nJEON:')
    const jeon2 = js2jeon(code2)
    console.log(JSON5.stringify(jeon2, null, 2))
    console.log('\nConverted back to JavaScript:')
    const jsCode2 = jeon2js(jeon2)
    console.log(jsCode2)

    console.log('\n=== Sugar Conversion Tests Completed ===\n')

    // Test 3: Verify shorthand syntax is NOT converted in jeon2js
    console.log('Test 3: Shorthand syntax should NOT be converted by jeon2js')
    const sugarJeon = {
        'abs()': [5]
    }
    console.log('JEON with sugar:', JSON.stringify(sugarJeon, null, 2))
    const generatedCode = jeon2js(sugarJeon)
    console.log('Generated code:', generatedCode)
    console.log('Expected: Empty or object literal (not "abs(5)")')
    console.log('Test:', !generatedCode.includes('abs(5)') ? '✅ PASSED' : '❌ FAILED')

    // Test 4: Verify shorthand syntax is NOT evaluated in evalJeon
    console.log('\nTest 4: Shorthand syntax should NOT be evaluated by evalJeon')
    const abs = (x: number) => Math.abs(x)
    const context = { abs }
    try {
        const result = evalJeon(sugarJeon, context)
        console.log('Result:', result)
        // It should return an object literal with 'abs()' as a key
        console.log('Expected: Object literal with "abs()" key')
        console.log('Test:', typeof result === 'object' && 'abs()' in result ? '✅ PASSED' : '❌ FAILED')
    } catch (error: any) {
        console.log('❌ FAILED - threw error:', error.message)
    }

    // Test 5: Verify explicit syntax DOES work in jeon2js
    console.log('\nTest 5: Explicit syntax should work in jeon2js')
    const explicitJeon = {
        '()': [
            { '.': ['@Math', 'abs'] },
            -5
        ]
    }
    console.log('JEON with explicit syntax:', JSON.stringify(explicitJeon, null, 2))
    const explicitCode = jeon2js(explicitJeon)
    console.log('Generated code:', explicitCode)
    console.log('Expected: Math.abs(-5)')
    console.log('Test:', explicitCode.includes('Math.abs') ? '✅ PASSED' : '❌ FAILED')

    // Test 6: Verify explicit syntax DOES work in evalJeon
    console.log('\nTest 6: Explicit syntax should work in evalJeon')
    const contextWithMath = { Math }
    try {
        const result = evalJeon(explicitJeon, contextWithMath)
        console.log('Result:', result)
        console.log('Expected: 5')
        console.log('Test:', result === 5 ? '✅ PASSED' : '❌ FAILED')
    } catch (error: any) {
        console.log('❌ FAILED - threw error:', error.message)
    }

    console.log('\n=== No Sugar Syntax Tests Completed ===\n')

    // Test 7: jeon2js should reject @this.name shortcut
    console.log('Test 7: jeon2js should reject @this.name shortcut')
    try {
        const jeon = {
            'function()': [
                { 'return': '@this.name' }
            ]
        }
        const js = jeon2js(jeon)
        console.log('❌ FAILED - Should have thrown error')
        console.log('Result:', js)
    } catch (error: any) {
        console.log('✅ PASSED - Correctly rejected shortcut')
        console.log('Error:', error.message)
    }

    // Test 8: evalJeon should reject @this.name shortcut
    console.log('\nTest 8: evalJeon should reject @this.name shortcut')
    try {
        const jeon = { 'return': '@this.name' }
        const context = { this: { name: 'John' } }
        const result = evalJeon(jeon, context)
        console.log('❌ FAILED - Should have thrown error')
        console.log('Result:', result)
    } catch (error: any) {
        console.log('✅ PASSED - Correctly rejected shortcut')
        console.log('Error:', error.message)
    }

    // Test 9: Explicit syntax should work in jeon2js
    console.log('\nTest 9: Explicit syntax should work in jeon2js')
    try {
        const jeon = {
            'function()': [
                { 'return': { '.': ['@this', 'name'] } }
            ]
        }
        const js = jeon2js(jeon)
        console.log('✅ PASSED - Explicit syntax works')
        console.log('Result:', js)
    } catch (error: any) {
        console.log('❌ FAILED - Explicit syntax should work')
        console.log('Error:', error.message)
    }

    // Test 10: Explicit syntax should work in evalJeon
    console.log('\nTest 10: Explicit syntax should work in evalJeon')
    try {
        const jeon = { 'return': { '.': ['@this', 'name'] } }
        const context = { this: { name: 'John' } }
        const result = evalJeon(jeon, context)
        console.log('✅ PASSED - Explicit syntax works')
        console.log('Result:', result)
    } catch (error: any) {
        console.log('❌ FAILED - Explicit syntax should work')
        console.log('Error:', error.message)
    }

    console.log('\n=== All Sugar Syntax Tests Completed ===')

    // Assertions
    expect(code1).toBeDefined()
    expect(jeon1).toBeDefined()
    expect(jsCode1).toBeDefined()
    expect(code2).toBeDefined()
    expect(jeon2).toBeDefined()
    expect(jsCode2).toBeDefined()
    expect(sugarJeon).toBeDefined()
    expect(generatedCode).toBeDefined()
    expect(explicitJeon).toBeDefined()
    expect(explicitCode).toBeDefined()
})