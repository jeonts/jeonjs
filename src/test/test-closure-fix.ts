import { jeon2js } from '../jeon2js'
import { evalJeon } from '../safeEval'

console.log('=== Testing Closure Fix ===\n')

// Test case from user: parenthesized function expression
const jeon = {
    '(': {
        'function(a, b)': [
            {
                'return': {
                    '+': [
                        '@a',
                        '@b'
                    ]
                }
            }
        ]
    }
}

console.log('JEON input:')
console.log(JSON.stringify(jeon, null, 2))

console.log('\n--- Without closure ---')
const codeWithout = jeon2js(jeon, { closure: false })
console.log('Generated code:')
console.log(codeWithout)

console.log('\n--- With closure ---')
const codeWith = jeon2js(jeon, { closure: true })
console.log('Generated code:')
console.log(codeWith)

console.log('\n--- Testing execution ---')
try {
    // Make evalJeon available in eval scope
    const func = eval(`(function() { const evalJeon = ${evalJeon.toString()}; return ${codeWith}; })()`)
    console.log('Function created:', typeof func)

    if (typeof func === 'function') {
        const result = func(5, 3)
        console.log('Result of func(5, 3):', result)
        console.log('Expected: 8')
        console.log('Test:', result === 8 ? '✅ PASSED' : '❌ FAILED')
    }
} catch (error: any) {
    console.error('Error:', error.message)
}

console.log('\n=== Test Complete ===')
