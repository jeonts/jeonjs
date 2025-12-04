// Accurate IIFE Detection and Unwrapping Test Cases
//
// This test demonstrates the actual IIFE detection and unwrapping logic 
// as implemented in index.tsx lines 247-285

import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

// Test cases that accurately reflect what the implementation handles
const testCases = [
    // Basic IIFE patterns (no arguments) - THESE WORK
    {
        name: "Basic function IIFE",
        code: "(function() { return 'hello'; })()",
        expectedIIFE: true
    },
    {
        name: "Basic arrow IIFE",
        code: "(() => { return 'hello'; })()",
        expectedIIFE: true
    },
    {
        name: "Async arrow IIFE",
        code: "(async () => { return 'hello'; })()",
        expectedIIFE: true
    },

    // IIFE with one level of extra parentheses - THESE WORK
    {
        name: "Function with one level of extra parentheses",
        code: "((function() { return 'hello'; }))()",
        expectedIIFE: true
    },
    {
        name: "Arrow function with one level of extra parentheses",
        code: "((() => { return 'hello'; }))()",
        expectedIIFE: true
    },

    // IIFE with multiple levels of parentheses - THESE DON'T WORK with current implementation
    {
        name: "Function with multiple levels of parentheses",
        code: "(((function() { return 'hello'; })))()",
        expectedIIFE: false // Current implementation only handles one level
    },

    // IIFE patterns with arguments (our logic only detects those with 0 arguments)
    {
        name: "Parameterized IIFE (with arguments)",
        code: "(function(name) { return 'Hello, ' + name; })('World')",
        expectedIIFE: false // Our logic specifically looks for 0 arguments
    },

    // Non-IIFE patterns
    {
        name: "Normal function declaration",
        code: "function normalFunction() { return 'hello'; }",
        expectedIIFE: false
    },
    {
        name: "Function expression assignment",
        code: "const fn = function() { return 'hello'; }",
        expectedIIFE: false
    },
    {
        name: "Arrow function assignment",
        code: "const fn = () => { return 'hello'; }",
        expectedIIFE: false
    },

    // Edge cases that work
    {
        name: "Nested IIFE",
        code: "(function() { return (function() { return 'nested'; })(); })()",
        expectedIIFE: true
    },
    {
        name: "IIFE with complex body",
        code: "(function() { const x = 1; const y = 2; return x + y; })()",
        expectedIIFE: true
    },
    {
        name: "IIFE with object literal",
        code: "(() => ({message: 'Hello World'}))()",
        expectedIIFE: true
    }
]

console.log('=== Accurate IIFE Detection and Unwrapping Test ===\n')
console.log('This test reflects the actual implementation in index.tsx lines 247-285\n')

testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.name}`)
    console.log(`Code: "${testCase.code}"`)

    try {
        const Parser = acorn.Parser.extend(jsx())
        const ast: any = Parser.parse(testCase.code, {
            ecmaVersion: 'latest',
            sourceType: 'module',
            allowReturnOutsideFunction: true,
            preserveParens: true
        })

        console.log('✓ Parsed successfully')

        // Apply the EXACT IIFE detection logic from index.tsx (lines 247-285)
        let isIIFE = false
        let extractedFunction = ''

        // Check if the top-level node is an expression statement containing a call expression
        // which calls a function expression - this is the pattern of an IIFE
        if (ast.body.length === 1 &&
            ast.body[0].type === 'ExpressionStatement' &&
            ast.body[0].expression.type === 'CallExpression' &&
            ast.body[0].expression.arguments.length === 0) { // No arguments to the IIFE call

            // Get the callee, which might be wrapped in parentheses
            let callee = ast.body[0].expression.callee

            // If it's a parenthesized expression, get the inner expression
            // NOTE: This only handles ONE level of parentheses
            if (callee.type === 'ParenthesizedExpression') {
                callee = callee.expression
            }

            // Check if the callee is a function expression or arrow function
            if (callee.type === 'FunctionExpression' || callee.type === 'ArrowFunctionExpression') {
                isIIFE = true

                // Extract the function part by removing the outer call parentheses
                // We need to find the source of just the function expression
                const functionStart = callee.start
                const functionEnd = callee.end
                extractedFunction = testCase.code.substring(functionStart, functionEnd)
            }
        }

        console.log(`Is IIFE: ${isIIFE}`)
        console.log(`Expected IIFE: ${testCase.expectedIIFE}`)

        if (isIIFE) {
            console.log(`Extracted function: "${extractedFunction}"`)
        }

        // Validation
        if (isIIFE === testCase.expectedIIFE) {
            console.log('✅ Test PASSED')
        } else {
            console.log('❌ Test FAILED')
        }

    } catch (error: any) {
        console.log(`❌ Parse error: ${error.message}`)
    }

    console.log('---\n')
})

// Demonstrate the unwrapping process exactly as in index.tsx
console.log('=== IIFE Unwrapping Process Demonstration ===\n')

const unwrapTestCases = [
    "(function() { return 'hello world'; })()",
    "(() => { const x = 42; return x * 2; })()",
    "((function() { return 'one level'; }))()",
    "((() => ({msg: 'object literal'}))())"
]

unwrapTestCases.forEach((codeToParse, index) => {
    console.log(`Unwrap Test ${index + 1}:`)
    console.log(`Original code: "${codeToParse}"`)

    try {
        const Parser = acorn.Parser.extend(jsx())
        const ast: any = Parser.parse(codeToParse, {
            ecmaVersion: 'latest',
            sourceType: 'module',
            allowReturnOutsideFunction: true,
            preserveParens: true
        })

        // Apply the EXACT unwrapping logic from index.tsx
        if (ast.body.length === 1 &&
            ast.body[0].type === 'ExpressionStatement' &&
            ast.body[0].expression.type === 'CallExpression' &&
            ast.body[0].expression.arguments.length === 0) {

            let callee = ast.body[0].expression.callee

            // Handle ONE level of parentheses
            if (callee.type === 'ParenthesizedExpression') {
                callee = callee.expression
            }

            if (callee.type === 'FunctionExpression' || callee.type === 'ArrowFunctionExpression') {
                const functionStart = callee.start
                const functionEnd = callee.end
                const unwrappedCode = codeToParse.substring(functionStart, functionEnd)

                console.log(`Unwrapped code: "${unwrappedCode}"`)
                console.log('✅ Successfully unwrapped IIFE\n')
                return
            }
        }

        console.log('ℹ️  Not an IIFE or not handled by current logic\n')
    } catch (error: any) {
        console.log(`❌ Error: ${error.message}\n`)
    }
})

console.log('=== Explanation of IIFE Detection Logic ===\n')
console.log('The IIFE detection logic in index.tsx (lines 247-285) works as follows:')
console.log('1. Parse the code with Acorn, preserving parentheses')
console.log('2. Check if the AST has exactly one top-level statement')
console.log('3. Verify it\'s an ExpressionStatement with a CallExpression')
console.log('4. Ensure the call has zero arguments (no parameters)')
console.log('5. Get the callee (function being called)')
console.log('6. Handle ONE level of parentheses by unwrapping if needed')
console.log('7. Check if the unwrapped callee is a FunctionExpression or ArrowFunctionExpression')
console.log('8. If so, extract just the function part (without the calling parentheses)')
console.log('')
console.log('This logic specifically targets IIFEs with no arguments and handles')
console.log('one level of extra parentheses around the function definition.')