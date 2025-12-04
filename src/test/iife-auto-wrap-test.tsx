// Test IIFE auto-wrap and unwrap functionality

import { js2jeon } from '../js2jeon'

// Test cases for IIFE conversion
const testCases = [
    // IIFE that should be unwrapped
    "(function() { return 'hello'; })()",
    // IIFE with parameters
    "(function(name) { return 'Hello, ' + name; })('World')",
    // Arrow function IIFE
    "(() => { return 'hello'; })()",
    // Regular function (should not be unwrapped)
    "function normalFunction() { return 'hello'; }"
]

console.log('Testing IIFE auto-wrap and unwrap functionality:')

testCases.forEach((testCase, index) => {
    console.log(`\nTest ${index + 1}: ${testCase}`)

    try {
        // Convert JavaScript to JEON
        const jeonResult = js2jeon(testCase)
        console.log('JEON Result:', JSON.stringify(jeonResult, null, 2))

        // Check if it's an IIFE by looking at the structure
        if (jeonResult && typeof jeonResult === 'object') {
            const keys = Object.keys(jeonResult)
            const isFunctionDeclaration = keys.some(key => key.includes('function'))
            const isCallExpression = keys.some(key => key === '()')

            if (isCallExpression) {
                console.log('✓ Detected as IIFE (call expression)')
            } else if (isFunctionDeclaration) {
                console.log('✓ Detected as regular function declaration')
            } else {
                console.log('○ Other expression type')
            }
        }
    } catch (error: any) {
        console.log(`Error: ${error.message}`)
    }
})