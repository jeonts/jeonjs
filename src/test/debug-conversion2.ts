import * as acorn from 'acorn'
import { ast2jeon } from '../js2jeon.visitors/ast2jeon'

console.log('=== Debug Conversion 2 ===')

// Test a single uninitialized variable declaration
const code = 'let d;'

console.log('Original code:')
console.log(code)

// Parse with acorn to see the AST
try {
    const ast = acorn.parse(code, { ecmaVersion: 'latest' })
    console.log('\nAST:')
    console.log(JSON.stringify(ast, null, 2))

    // Convert just the VariableDeclaration node
    if (ast.body[0].type === 'VariableDeclaration') {
        const varDecl = ast.body[0]
        console.log('\nVariableDeclaration node:')
        console.log(JSON.stringify(varDecl, null, 2))

        // Convert to JEON using ast2jeon directly
        const jeon = ast2jeon(varDecl)
        console.log('\nJEON from ast2jeon:')
        console.log(JSON.stringify(jeon, null, 2))
    }

} catch (e: any) {
    console.log('Error:', e.message)
    console.log(e.stack)
}