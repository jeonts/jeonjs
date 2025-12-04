// Test IIFE detection and unwrapping as it happens in the UI

import * as acorn from 'acorn'
import jsx from 'acorn-jsx'
import { js2jeon } from '../js2jeon'

// Simulate the IIFE detection and unwrapping logic from the UI
function detectAndUnwrapIIFE(code: string): string {
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

                console.log(`IIFE detected and unwrapped: ${functionCode}`)
                return functionCode  // Return the unwrapped function
            }
        }

        return code // Return original code if not an IIFE
    } catch (e) {
        // If parsing fails, it's not a valid IIFE or not parsable, continue with original code
        console.log('Failed to parse as IIFE, using original code')
        return code
    }
}

// Test cases
const testCases = [
    "(function() { return 'Hello, JEON!'; })()",
    "(() => { const x = 42; return x * 2; })()",
    "function greet() { return 'Hello, World!'; }" // Regular function
]

console.log('Testing IIFE detection and unwrapping simulation:')

testCases.forEach((testCase, index) => {
    console.log(`\n--- Test ${index + 1} ---`)
    console.log('Original code:', testCase)

    // Step 1: Detect and unwrap IIFE (UI logic)
    const unwrappedCode = detectAndUnwrapIIFE(testCase)
    console.log('After IIFE unwrapping:', unwrappedCode)

    // Step 2: Convert to JEON
    try {
        const jeonResult = js2jeon(unwrappedCode)
        console.log('JEON result:', JSON.stringify(jeonResult, null, 2))
    } catch (error: any) {
        console.log(`Conversion error: ${error.message}`)
    }
})