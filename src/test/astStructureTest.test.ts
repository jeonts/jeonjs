import * as acorn from 'acorn'
import jsx from 'acorn-jsx'
import { expect, test } from '@woby/chk'

// Test AST structure for different variable declaration contexts
const codes = [
    `let a = 1; let b = 2;`,
    `function test() { let a = 1; let b = 2; }`,
    `const arrow = () => { let a = 1; let b = 2; };`,
    `class Test { method() { let a = 1; let b = 2; } }`
]

test('AST Structure Tests', () => {
    codes.forEach((code, index) => {
        test(`Test ${index + 1}: Variable declaration context`, () => {
            console.log(`\n=== Test ${index + 1}: ${code} ===`)
            try {
                const Parser = acorn.Parser.extend(jsx())
                const ast = Parser.parse(code, {
                    ecmaVersion: 'latest',
                    sourceType: 'module',
                    allowReturnOutsideFunction: true
                })

                expect(ast).toBeDefined()
                expect(ast.type).toBe('Program')

                console.log('AST structure:')
                console.log(JSON.stringify(ast, null, 2))
            } catch (error: any) {
                expect(error).toBeUndefined() // This will fail and show the error
            }
        })
    })

    // Test AST structure for different function types
    const anonymousFunctionCode = `(function(name) { return ("Hello, " + name) })`
    const namedFunctionCode = `function a(name) { return ("Hello, " + name) }`
    const arrowFunctionCode = `(x) => { return (x * 2); }`

    test('Anonymous function AST structure', () => {
        console.log('=== Testing Anonymous Function AST Structure ===')
        try {
            const Parser = acorn.Parser.extend(jsx())
            const anonymousAst = Parser.parse(anonymousFunctionCode, {
                ecmaVersion: 'latest',
                sourceType: 'module',
                allowReturnOutsideFunction: true
            })

            expect(anonymousAst).toBeDefined()
            expect(anonymousAst.type).toBe('Program')

            console.log('Anonymous function AST:')
            console.log(JSON.stringify(anonymousAst.body[0], null, 2))
        } catch (error: any) {
            expect(error).toBeUndefined() // This will fail and show the error
        }
    })

    test('Named function AST structure', () => {
        console.log('\n=== Testing Named Function AST Structure ===')
        try {
            const Parser = acorn.Parser.extend(jsx())
            const namedAst = Parser.parse(namedFunctionCode, {
                ecmaVersion: 'latest',
                sourceType: 'module',
                allowReturnOutsideFunction: true
            })

            expect(namedAst).toBeDefined()
            expect(namedAst.type).toBe('Program')

            console.log('Named function AST:')
            console.log(JSON.stringify(namedAst.body[0], null, 2))
        } catch (error: any) {
            expect(error).toBeUndefined() // This will fail and show the error
        }
    })

    test('Arrow function AST structure', () => {
        console.log('\n=== Testing Arrow Function AST Structure ===')
        try {
            const Parser = acorn.Parser.extend(jsx())
            const arrowAst = Parser.parse(arrowFunctionCode, {
                ecmaVersion: 'latest',
                sourceType: 'module',
                allowReturnOutsideFunction: true
            })

            expect(arrowAst).toBeDefined()
            expect(arrowAst.type).toBe('Program')

            console.log('Arrow function AST:')
            console.log(JSON.stringify(arrowAst.body[0], null, 2))
        } catch (error: any) {
            expect(error).toBeUndefined() // This will fail and show the error
        }
    })
})