import { jeon2js } from '../jeon2js'
import { evalJeon } from '../safeEval'

console.log('=== Testing Sugar Syntax Removal ===\n')

// Test 1: Verify shorthand syntax is NOT converted in jeon2js
console.log('Test 1: Shorthand syntax should NOT be converted by jeon2js')
const sugarJeon = {
    'abs()': [5]
}
console.log('JEON with sugar:', JSON.stringify(sugarJeon, null, 2))
const generatedCode = jeon2js(sugarJeon)
console.log('Generated code:', generatedCode)
console.log('Expected: Empty or object literal (not "abs(5)")')
console.log('Test:', !generatedCode.includes('abs(5)') ? '✅ PASSED' : '❌ FAILED')

// Test 2: Verify shorthand syntax is NOT evaluated in evalJeon
console.log('\nTest 2: Shorthand syntax should NOT be evaluated by evalJeon')
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

// Test 3: Verify explicit syntax DOES work in jeon2js
console.log('\nTest 3: Explicit syntax should work in jeon2js')
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

// Test 4: Verify explicit syntax DOES work in evalJeon
console.log('\nTest 4: Explicit syntax should work in evalJeon')
const contextWithMath = { Math }
try {
    const result = evalJeon(explicitJeon, contextWithMath)
    console.log('Result:', result)
    console.log('Expected: 5')
    console.log('Test:', result === 5 ? '✅ PASSED' : '❌ FAILED')
} catch (error: any) {
    console.log('❌ FAILED - threw error:', error.message)
}

console.log('\n=== All Tests Complete ===')
