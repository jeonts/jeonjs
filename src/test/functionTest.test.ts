import * as acorn from 'acorn'
import jsx from 'acorn-jsx'
import { expect, test } from '@woby/chk'
import { ast2jeon } from '../js2jeon.visitors/ast2jeon'

// Test different function types with valid syntax
const functionExpressionCode = `(function(name) { return ("Hello, " + name) })`
const namedFunctionCode = `function a(name) { return ("Hello, " + name) }`
const arrowFunctionCode = `(x) => { return (x * 2); }`

test('Function AST Parsing Tests', () => {
    test('Function Expression AST Parsing', () => {
        try {
            const Parser = acorn.Parser.extend(jsx())
            const functionExpressionAst = Parser.parse(functionExpressionCode, {
                ecmaVersion: 'latest',
                sourceType: 'module',
                allowReturnOutsideFunction: true
            })

            // Extract the function expression from the AST
            const functionExpression = (functionExpressionAst.body[0] as acorn.ExpressionStatement).expression
            const functionExpressionJeon = ast2jeon(functionExpression)

            expect(functionExpressionJeon).toBeDefined()
            expect(typeof functionExpressionJeon).toBe('object')

            console.log('Function expression JEON:')
            console.log(JSON.stringify(functionExpressionJeon, null, 2))
        } catch (error: any) {
            expect(error).toBeUndefined() // This will fail and show the error
        }
    })

    test('Named Function AST Parsing', () => {
        try {
            const Parser = acorn.Parser.extend(jsx())
            const namedAst = Parser.parse(namedFunctionCode, {
                ecmaVersion: 'latest',
                sourceType: 'module',
                allowReturnOutsideFunction: true
            })

            // The named function is already a FunctionDeclaration
            const functionDeclaration = namedAst.body[0] as acorn.FunctionDeclaration
            const namedJeon = ast2jeon(functionDeclaration)

            expect(namedJeon).toBeDefined()
            expect(typeof namedJeon).toBe('object')

            console.log('Named function JEON:')
            console.log(JSON.stringify(namedJeon, null, 2))
        } catch (error: any) {
            expect(error).toBeUndefined() // This will fail and show the error
        }
    })

    test('Arrow Function AST Parsing', () => {
        try {
            const Parser = acorn.Parser.extend(jsx())
            const arrowAst = Parser.parse(arrowFunctionCode, {
                ecmaVersion: 'latest',
                sourceType: 'module',
                allowReturnOutsideFunction: true
            })

            // Extract the arrow function expression from the AST
            const arrowFunctionExpression = (arrowAst.body[0] as acorn.ExpressionStatement).expression
            const arrowJeon = ast2jeon(arrowFunctionExpression)

            expect(arrowJeon).toBeDefined()
            expect(typeof arrowJeon).toBe('object')

            console.log('Arrow function JEON:')
            console.log(JSON.stringify(arrowJeon, null, 2))
        } catch (error: any) {
            expect(error).toBeUndefined() // This will fail and show the error
        }
    })
})