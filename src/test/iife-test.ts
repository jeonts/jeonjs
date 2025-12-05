import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== IIFE Test ===\n')

// Test IIFE cases
const testCases = [
    {
        name: 'Simple IIFE',
        code: '(function() { return 42; })()'
    },
    {
        name: 'IIFE with parameters',
        code: '(function(x, y) { return x + y; })(3, 4)'
    },
    {
        name: 'IIFE with closure',
        code: '(function() { const x = 10; return function(y) { return x + y; }; })()(5)'
    }
]

try {
    testCases.forEach((testCase, index) => {
        console.log(`\n--- Test Case ${index + 1}: ${testCase.name} ---`)
        console.log('JavaScript code:')
        console.log(testCase.code)

        try {
            // Convert to JEON
            console.log('\nConverting to JEON...')
            const jeon = js2jeon(testCase.code)
            console.log('JEON representation:')
            console.log(JSON.stringify(jeon, null, 2))

            // Try to evaluate with current evalJeon
            console.log('\nAttempting to evaluate with evalJeon...')
            const result = evalJeon(jeon)
            console.log('Evaluation result:', result)
            console.log('Type of result:', typeof result)

            console.log('✅ Success')
        } catch (error: any) {
            console.error('❌ Error during evaluation:', error.message)
            console.error('Stack:', error.stack)
        }
    })

    console.log('\n=== IIFE Test completed ===')

} catch (error: any) {
    console.error('❌ Unexpected error:', error.message)
    console.error('Stack:', error.stack)
}