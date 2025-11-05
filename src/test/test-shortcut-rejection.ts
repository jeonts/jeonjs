import { jeon2js } from '../jeon2js'
import { evalJeon } from '../safeEval'

console.log('=== Testing Shortcut Rejection ===\n')

// Test 1: jeon2js should reject @this.name shortcut
console.log('Test 1: jeon2js should reject @this.name shortcut')
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

// Test 2: evalJeon should reject @this.name shortcut
console.log('\nTest 2: evalJeon should reject @this.name shortcut')
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

// Test 3: Explicit syntax should work in jeon2js
console.log('\nTest 3: Explicit syntax should work in jeon2js')
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

// Test 4: Explicit syntax should work in evalJeon
console.log('\nTest 4: Explicit syntax should work in evalJeon')
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

console.log('\n=== All Tests Complete ===')
