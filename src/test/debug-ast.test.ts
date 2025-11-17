import * as acorn from 'acorn'
import { expect, test } from '@woby/chk'

test('Debug AST parsing of function with uninitialized variables', () => {
    console.log('=== Debug AST ===')

    // Test a simple function with multiple uninitialized variables
    const code = 'function sum(a, b) {let d;const f = 22;var g; return a + b;}'

    console.log('Original code:')
    console.log(code)

    // Parse with acorn to see the AST
    try {
        const ast = acorn.parse(code, { ecmaVersion: 'latest' })
        console.log('\nAST:')
        console.log(JSON.stringify(ast, null, 2))

        // Look specifically at the function body
        if (ast.body[0].type === 'FunctionDeclaration' && ast.body[0].body.type === 'BlockStatement') {
            console.log('\nFunction body statements:')
            ast.body[0].body.body.forEach((stmt: any, index: number) => {
                console.log(`Statement ${index}: ${stmt.type}`)
                if (stmt.type === 'VariableDeclaration') {
                    console.log(`  Kind: ${stmt.kind}`)
                    console.log(`  Declarations: ${stmt.declarations.length}`)
                    stmt.declarations.forEach((decl: any, declIndex: number) => {
                        console.log(`    Declaration ${declIndex}: ${decl.id.name} = ${decl.init ? 'initialized' : 'uninitialized'}`)
                    })
                }
            })
        }

        // Assertions
        expect(ast).toBeDefined()
        expect(ast.body).toBeDefined()
        expect(ast.body.length).toBeGreaterThan(0)
    } catch (e: any) {
        console.log('Error:', e.message)
        console.log(e.stack)
        throw e
    }
})