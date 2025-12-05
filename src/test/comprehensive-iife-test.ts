// Comprehensive test for IIFE handling
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { convertToIIFE } from '../iifeConverter'

console.log('=== Comprehensive IIFE Test ===\n')

const testCases = [
    {
        name: 'Arrow function IIFE with parameter',
        code: '((x) => { return (x * 2); })(4)'
    },
    {
        name: 'Function expression IIFE with parameter',
        code: '(function(x) { return x * 2; })(4)'
    },
    {
        name: 'Simple arrow function IIFE',
        code: '(() => 42)()'
    },
    {
        name: 'Function expression IIFE with no parameters',
        code: '(function() { return 42; })()'
    },
    {
        name: 'Nested parentheses IIFE',
        code: '((function() { return 42; }))()'
    }
]

testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.name}`)
    console.log(`Code: ${testCase.code}`)

    try {
        // Step 1: Convert JavaScript to JEON
        const jeonResult = js2jeon(testCase.code)
        console.log('JEON:')
        console.log(JSON.stringify(jeonResult, null, 2))

        // Step 2: Convert JEON back to JavaScript
        const jsResult = jeon2js(jeonResult)
        console.log('Back to JS:')
        console.log(jsResult)

        // Step 3: Apply IIFE conversion
        const iifeResult = convertToIIFE(jsResult)
        console.log('IIFE converted:')
        console.log(iifeResult)

        console.log('✅ Success\n')
    } catch (error: any) {
        console.log(`❌ Error: ${error.message}\n`)
    }
})

console.log('=== Test Completed ===')