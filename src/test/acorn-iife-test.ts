// Test Acorn-based IIFE detection

import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

// Test cases
const testCases = [
    "(function() { return 'hello'; })()",
    "(function(name) { return 'Hello, ' + name; })('World')",
    "(() => { return 'hello'; })()",
    "(async () => { return 'hello'; })()",
    "function normalFunction() { return 'hello'; }", // Not an IIFE
    "(() => { return 'hello'; }())", // Alternative IIFE syntax
]

console.log('Testing Acorn-based IIFE detection:')

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

        // Check if it's an IIFE
        const isIIFE = ast.body.length === 1 &&
            ast.body[0].type === 'ExpressionStatement' &&
            ast.body[0].expression.type === 'CallExpression' &&
            (ast.body[0].expression.callee.type === 'FunctionExpression' ||
                ast.body[0].expression.callee.type === 'ArrowFunctionExpression')

        console.log(`Is IIFE: ${isIIFE}`)

        if (isIIFE) {
            // Extract the function part
            const functionStart = ast.body[0].expression.callee.start
            const functionEnd = ast.body[0].expression.callee.end
            const functionCode = testCase.substring(functionStart, functionEnd)
            console.log(`Extracted function: "${functionCode}"`)
        }

    } catch (error: any) {
        console.log(`Parse error: ${error.message}`)
    }
})