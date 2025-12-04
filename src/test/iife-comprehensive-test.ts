// Comprehensive IIFE Detection and Unwrapping Test Cases
//
// This test demonstrates the IIFE detection and unwrapping logic 
// with various combinations of patterns

import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

// Test cases covering various IIFE patterns
const testCases = [
    // Basic IIFE patterns (no arguments)
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
    {
        name: "Function call with arguments",
        code: "someFunction('arg')",
        expectedIIFE: false
    },

    // Edge cases
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

    // Parenthesized expressions (extra parentheses around the function)
    {
        name: "Function with extra parentheses",
        code: "((function() { return 'hello'; }))()",
        expectedIIFE: true
    },
    {
        name: "Arrow function with extra parentheses",
        code: "((() => { return 'hello'; }))()",
        expectedIIFE: true
    },
    {
        name: "IIFE with object literal",
        code: "(() => ({message: 'Hello World'}))()",
        expectedIIFE: true
    }
]

console.log('=== Comprehensive IIFE Detection and Unwrapping Test ===\n')

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

        // Apply the IIFE detection logic from index.tsx (lines 247-285)
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

// Additional test to show the unwrapping process
console.log('=== IIFE Unwrapping Demonstration ===\n')

const unwrapTestCases = [
    "(function() { return 'hello world'; })()",
    "(() => { const x = 42; return x * 2; })()",
    "((() => { return <div>JSX Content</div>; }))()"
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

        // Apply the unwrapping logic
        if (ast.body.length === 1 &&
            ast.body[0].type === 'ExpressionStatement' &&
            ast.body[0].expression.type === 'CallExpression' &&
            ast.body[0].expression.arguments.length === 0) {

            let callee = ast.body[0].expression.callee

            if (callee.type === 'ParenthesizedExpression') {
                callee = callee.expression
            }

            if (callee.type === 'FunctionExpression' || callee.type === 'ArrowFunctionExpression') {
                const functionStart = callee.start
                const functionEnd = callee.end
                const unwrappedCode = codeToParse.substring(functionStart, functionEnd)

                console.log(`Unwrapped code: "${unwrappedCode}"`)
                console.log('✅ Successfully unwrapped IIFE\n')
            }
        }
    } catch (error: any) {
        console.log(`❌ Error: ${error.message}\n`)
    }
})