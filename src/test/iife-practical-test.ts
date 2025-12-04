// Practical test showing how IIFE unwrapping works in practice

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

// Test practical scenarios
console.log('Testing practical IIFE scenarios:')

// Test 1: Arrow function IIFE (works well)
const arrowIIFE = "(() => { return 'Hello World'; })()"
console.log('\n1. Arrow function IIFE:')
console.log('Original:', arrowIIFE)
const unwrapped1 = detectAndUnwrapIIFE(arrowIIFE)
console.log('Unwrapped:', unwrapped1)
try {
    const jeon1 = js2jeon(unwrapped1)
    console.log('JEON:', JSON.stringify(jeon1, null, 2))
} catch (error: any) {
    console.log('Error:', error.message)
}

// Test 2: Function expression IIFE (needs wrapping for parsing)
const funcExprIIFE = "(function() { return 'Hello World'; })()"
console.log('\n2. Function expression IIFE:')
console.log('Original:', funcExprIIFE)
const unwrapped2 = detectAndUnwrapIIFE(funcExprIIFE)
console.log('Unwrapped:', unwrapped2)
try {
    // Try parsing as-is first
    const jeon2a = js2jeon(unwrapped2)
    console.log('JEON (direct):', JSON.stringify(jeon2a, null, 2))
} catch (error: any) {
    console.log('Direct parsing failed, trying with parentheses wrapping...')
    try {
        // Wrap in parentheses like the UI does for other expressions
        const wrapped = `(${unwrapped2})`
        console.log('Wrapped:', wrapped)
        const jeon2b = js2jeon(wrapped)
        console.log('JEON (wrapped):', JSON.stringify(jeon2b, null, 2))
    } catch (wrapError: any) {
        console.log('Wrapped parsing error:', wrapError.message)
    }
}

// Test 3: Regular function (should remain unchanged)
const regularFunc = "function hello() { return 'Hello World'; }"
console.log('\n3. Regular function:')
console.log('Original:', regularFunc)
const unwrapped3 = detectAndUnwrapIIFE(regularFunc)
console.log('Unwrapped:', unwrapped3)
try {
    const jeon3 = js2jeon(unwrapped3)
    console.log('JEON:', JSON.stringify(jeon3, null, 2))
} catch (error: any) {
    console.log('Error:', error.message)
}