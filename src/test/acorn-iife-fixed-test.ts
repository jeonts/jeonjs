// Test fixed Acorn-based IIFE detection

import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

// Test cases
const testCases = [
    "(function() { return 'hello'; })()",
    "(function(name) { return 'Hello, ' + name; })('World')",
    "(() => { return 'hello'; })()",
    "(async () => { return 'hello'; })()",
    "function normalFunction() { return 'hello'; }", // Not an IIFE
]

console.log('Testing fixed Acorn-based IIFE detection:')

testCases.forEach((testCase, index) => {
    console.log(`\nTest ${index + 1}: "${testCase}"`)

    try {
        const Parser = acorn.Parser.extend(jsx())
        const ast: any = Parser.parse(testCase, {
            ecmaVersion: 'latest',
            sourceType: 'module',
            allowReturnOutsideFunction: true,
            preserveParens: true
        })

        console.log('Parsed successfully')

        // Check if it's an IIFE using our fixed logic
        let isIIFE = false
        let functionCode = ''

        if (ast.body.length === 1 &&
            ast.body[0].type === 'ExpressionStatement' &&
            ast.body[0].expression.type === 'CallExpression' &&
            ast.body[0].expression.arguments.length === 0) {

            // Get the callee, which might be wrapped in parentheses
            let callee = ast.body[0].expression.callee

            // If it's a parenthesized expression, get the inner expression
            if (callee.type === 'ParenthesizedExpression') {
                callee = callee.expression
            }

            // Check if the callee is a function expression or arrow function
            if (callee.type === 'FunctionExpression' || callee.type === 'ArrowFunctionExpression') {
                isIIFE = true
                // Extract the function part
                const functionStart = callee.start
                const functionEnd = callee.end
                functionCode = testCase.substring(functionStart, functionEnd)
            }
        }

        console.log(`Is IIFE: ${isIIFE}`)

        if (isIIFE) {
            console.log(`Extracted function: "${functionCode}"`)
        }

    } catch (error: any) {
        console.log(`Parse error: ${error.message}`)
    }
})