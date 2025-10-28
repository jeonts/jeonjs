import * as acorn from 'acorn'
import jsx from 'acorn-jsx'
import { expect, test } from '@woby/chk'
import { ast2jeon } from '../js2jeon.visitors/ast2jeon'

// Test anonymous function parsing
const anonymousFunctionCode = `(function(name) { return ("Hello, " + name) })`
const namedFunctionCode = `function a(name) { return ("Hello, " + name) }`
const arrowFunctionCode = `(x) => { return (x * 2); }`

test('Anonymous Function Parsing Tests', () => {
    test('Anonymous function AST parsing', () => {
        try {
            const Parser = acorn.Parser.extend(jsx())
            const anonymousAst = Parser.parse(anonymousFunctionCode, {
                ecmaVersion: 'latest',
                sourceType: 'module',
                allowReturnOutsideFunction: true
            })

            // Extract the function expression from the AST
            const functionExpression = (anonymousAst.body[0] as acorn.ExpressionStatement).expression
            const anonymousJeon = ast2jeon(functionExpression)

            expect(anonymousJeon).toBeDefined()
            expect(typeof anonymousJeon).toBe('object')

            console.log('Anonymous function JEON:')
            console.log(JSON.stringify(anonymousJeon, null, 2))
        } catch (error: any) {
            expect(error).toBeUndefined() // This will fail and show the error
        }
    })

    test('Named function AST parsing', () => {
        try {
            const Parser = acorn.Parser.extend(jsx())
            const namedAst = Parser.parse(namedFunctionCode, {
                ecmaVersion: 'latest',
                sourceType: 'module',
                allowReturnOutsideFunction: true
            })

            // Extract the function declaration from the AST
            const functionDeclaration = namedAst.body[0]
            const namedJeon = ast2jeon(functionDeclaration)

            expect(namedJeon).toBeDefined()
            expect(typeof namedJeon).toBe('object')

            console.log('Named function JEON:')
            console.log(JSON.stringify(namedJeon, null, 2))
        } catch (error: any) {
            expect(error).toBeUndefined() // This will fail and show the error
        }
    })

    test('Arrow function AST parsing', () => {
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