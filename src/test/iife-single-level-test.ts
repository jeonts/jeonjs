// Test to understand the single level parentheses issue

import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

const code = "((function() { return 'hello'; }))()"

console.log(`Code: ${code}\n`)

try {
    const Parser = acorn.Parser.extend(jsx())
    const ast: any = Parser.parse(code, {
        ecmaVersion: 'latest',
        sourceType: 'module',
        allowReturnOutsideFunction: true,
        preserveParens: true
    })

    console.log('AST for callee:')
    const callee = ast.body[0].expression.callee
    console.log(`Initial callee type: ${callee.type}`)

    // This is what the current implementation does:
    if (callee.type === 'ParenthesizedExpression') {
        const unwrapped = callee.expression
        console.log(`After one unwrap - type: ${unwrapped.type}`)

        // But it doesn't check if we need to unwrap again!
        if (unwrapped.type === 'ParenthesizedExpression') {
            const doubleUnwrapped = unwrapped.expression
            console.log(`After two unwraps - type: ${doubleUnwrapped.type}`)

            if (doubleUnwrapped.type === 'FunctionExpression' || doubleUnwrapped.type === 'ArrowFunctionExpression') {
                console.log('✅ Would be an IIFE if we handled multiple levels!')
                const functionCode = code.substring(doubleUnwrapped.start, doubleUnwrapped.end)
                console.log(`Function code: ${functionCode}`)
            }
        } else {
            console.log('❌ Still not a function after one unwrap')
        }
    }

} catch (error: any) {
    console.log(`Error: ${error.message}`)
}