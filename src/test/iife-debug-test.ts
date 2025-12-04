// Debug IIFE Detection Logic
//
// Let's debug why the parenthesized expressions aren't working

import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

const testCases = [
    "(function() { return 'hello'; })()",
    "((function() { return 'hello'; }))()"
]

testCases.forEach((code, index) => {
    console.log(`\n=== Test Case ${index + 1} ===`)
    console.log(`Code: ${code}`)

    try {
        const Parser = acorn.Parser.extend(jsx())
        const ast: any = Parser.parse(code, {
            ecmaVersion: 'latest',
            sourceType: 'module',
            allowReturnOutsideFunction: true,
            preserveParens: true
        })

        console.log('AST Structure:')
        console.log(JSON.stringify(ast, null, 2))

        // Check the specific conditions
        console.log('\nCondition Checks:')
        console.log(`ast.body.length === 1: ${ast.body.length === 1} (${ast.body.length})`)

        if (ast.body.length === 1) {
            console.log(`ast.body[0].type === 'ExpressionStatement': ${ast.body[0].type === 'ExpressionStatement'} (${ast.body[0].type})`)

            if (ast.body[0].type === 'ExpressionStatement') {
                console.log(`ast.body[0].expression.type === 'CallExpression': ${ast.body[0].expression.type === 'CallExpression'} (${ast.body[0].expression.type})`)

                if (ast.body[0].expression.type === 'CallExpression') {
                    console.log(`ast.body[0].expression.arguments.length === 0: ${ast.body[0].expression.arguments.length === 0} (${ast.body[0].expression.arguments.length})`)

                    if (ast.body[0].expression.arguments.length === 0) {
                        console.log(`Callee type: ${ast.body[0].expression.callee.type}`)

                        let callee = ast.body[0].expression.callee

                        if (callee.type === 'ParenthesizedExpression') {
                            console.log('Found ParenthesizedExpression, unwrapping...')
                            callee = callee.expression
                            console.log(`Unwrapped callee type: ${callee.type}`)
                        }

                        const isFunction = (callee.type === 'FunctionExpression' || callee.type === 'ArrowFunctionExpression')
                        console.log(`Is function expression: ${isFunction}`)
                    }
                }
            }
        }

    } catch (error: any) {
        console.log(`Error: ${error.message}`)
    }
})