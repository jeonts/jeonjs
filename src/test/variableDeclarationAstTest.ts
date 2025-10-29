import { expect, test } from '@woby/chk'
import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

test('Variable Declaration AST Test', () => {
    // Test AST structure for different variable declaration patterns
    const codes = [
        `let a = 1; let b = 2; const C = 3; const d = 5;`,
        `let a = 1, b = 2; const C = 3, d = 5;`
    ]

    codes.forEach((code, index) => {
        test(`Test ${index + 1}: Variable declaration pattern`, () => {
            console.log(`\n=== Test ${index + 1}: ${code} ===`)
            try {
                const Parser = acorn.Parser.extend(jsx())
                const ast = Parser.parse(code, {
                    ecmaVersion: 'latest',
                    sourceType: 'module',
                    allowReturnOutsideFunction: true
                })

                console.log('Program body:')
                ast.body.forEach((stmt: any, stmtIndex: number) => {
                    console.log(`  ${stmtIndex}: ${stmt.type}`)
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
            } catch (error) {
                console.error('Error:', error)
                expect(error).toBeUndefined()
            }
        })
    })
})