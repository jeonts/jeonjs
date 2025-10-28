import { expect, test } from '@woby/chk'
import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

test('Simple AST Test', () => {
    // Test AST structure for variable declarations
    const code = `let a = 1; let b = 2;`

    console.log('=== AST Structure Test ===')
    console.log('Code:', code)

    test('AST parsing and structure validation', () => {
        try {
            const Parser = acorn.Parser.extend(jsx())
            const ast = Parser.parse(code, {
                ecmaVersion: 'latest',
                sourceType: 'module',
                allowReturnOutsideFunction: true
            })

            console.log('\nProgram body:')
            ast.body.forEach((stmt: any, index: number) => {
                console.log(`  ${index}: ${stmt.type}`)
                if (stmt.type === 'VariableDeclaration') {
                    console.log(`    kind: ${stmt.kind}`)
                    console.log(`    declarations: ${stmt.declarations.length}`)
                    stmt.declarations.forEach((decl: any, declIndex: number) => {
                        console.log(`      ${declIndex}: ${decl.type} (${decl.id.name})`)
                    })
                }
            })
            
            expect(ast).toBeDefined()
            expect(ast.body).toBeDefined()
            expect(ast.body.length).toBeGreaterThan(0)
        } catch (error) {
            console.error('Error:', error)
            expect(error).toBeUndefined()
        }
    })
})