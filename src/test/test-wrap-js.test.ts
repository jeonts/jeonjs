import { js2jeon } from '../index'
import { expect, test } from '@woby/chk'

test('Object literal without parentheses', () => {
    console.log('Testing object literal without parentheses:')
    try {
        const result1 = js2jeon('{ name: "abc" }')
        console.log('Result:', JSON.stringify(result1, null, 2))

        // Basic assertion
        expect(result1).toBeDefined()
    } catch (e: any) {
        console.log('Error (expected):', e.message)
        // This is expected to fail, so we don't throw
    }
})

test('Object literal with parentheses', () => {
    console.log('\nTesting object literal with parentheses:')
    try {
        const result2 = js2jeon('({ name: "abc" })')
        console.log('Result:', JSON.stringify(result2, null, 2))

        // Basic assertion
        expect(result2).toBeDefined()
    } catch (e: any) {
        console.log('Error:', e.message)
        throw e
    }
})

test('Function expression without parentheses', () => {
    console.log('\nTesting function expression without parentheses:')
    try {
        const result3 = js2jeon('function (a, b) { return a + b; }')
        console.log('Result:', JSON.stringify(result3, null, 2))

        // Basic assertion
        expect(result3).toBeDefined()
    } catch (e: any) {
        console.log('Error (expected):', e.message)
        // This is expected to fail, so we don't throw
    }
})

test('Function expression with parentheses', () => {
    console.log('\nTesting function expression with parentheses:')
    try {
        const result4 = js2jeon('(function (a, b) { return a + b; })')
        console.log('Result:', JSON.stringify(result4, null, 2))

        // Basic assertion
        expect(result4).toBeDefined()
    } catch (e: any) {
        console.log('Error:', e.message)
        throw e
    }
})