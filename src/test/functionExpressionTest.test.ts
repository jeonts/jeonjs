import * as acorn from 'acorn'
import jsx from 'acorn-jsx'
import { expect, test } from '@woby/chk'

// Test AST structure for function expression
const functionExpressionCode = `(function(name) { return ("Hello, " + name) })`

test('Function Expression AST Structure Test', () => {
    test('Parses function expression AST correctly', () => {
        console.log('=== Testing Function Expression AST Structure ===')
        try {
            const Parser = acorn.Parser.extend(jsx())
            const functionExpressionAst = Parser.parse(functionExpressionCode, {
                ecmaVersion: 'latest',
                sourceType: 'module',
                allowReturnOutsideFunction: true
            })
            
            expect(functionExpressionAst).toBeDefined()
            expect(functionExpressionAst.type).toBe('Program')
            
            console.log('Function expression AST:')
            console.log(JSON.stringify(functionExpressionAst.body[0], null, 2))
            
            // Additional assertions
            const expressionStatement = functionExpressionAst.body[0] as acorn.ExpressionStatement
            expect(expressionStatement.type).toBe('ExpressionStatement')
            expect(expressionStatement.expression.type).toBe('FunctionExpression')
        } catch (error: any) {
            expect(error).toBeUndefined() // This will fail and show the error
        }
    })
})