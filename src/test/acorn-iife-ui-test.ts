// Test Acorn-based IIFE detection for UI

import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

// Test IIFE detection function
function isIIFE(code: string): { isIIFE: boolean; functionCode?: string } {
    try {
        const Parser = acorn.Parser.extend(jsx())
        const ast: any = Parser.parse(code, {
            ecmaVersion: 'latest',
            sourceType: 'module',
            allowReturnOutsideFunction: true,
            preserveParens: true
        })

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
                // Extract the function part by removing the outer call parentheses
                // We need to find the source of just the function expression
                const functionStart = callee.start
                const functionEnd = callee.end
                const functionCode = code.substring(functionStart, functionEnd)

                return { isIIFE: true, functionCode }
            }
        }

        return { isIIFE: false }
    } catch (e) {
        // If parsing fails, it's not a valid IIFE or not parsable
        return { isIIFE: false }
    }
}

// Test cases
const testCases = [
    "(function() { return 'hello'; })()",
    "(function(name) { return 'Hello, ' + name; })('World')",
    "(() => { return 'hello'; })()",
    "function normalFunction() { return 'hello'; }"
]

console.log('Testing Acorn-based IIFE detection:')

testCases.forEach((testCase, index) => {
    console.log(`\nTest ${index + 1}: ${testCase}`)

    const result = isIIFE(testCase)
    console.log(`Is IIFE: ${result.isIIFE}`)

    if (result.isIIFE && result.functionCode) {
        console.log(`Extracted function: ${result.functionCode}`)
    }
})