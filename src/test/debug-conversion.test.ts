import { js2jeon } from '../js2jeon'
import * as acorn from 'acorn'
import { expect, test } from '@woby/chk'

test('Debug conversion of uninitialized variable declaration', () => {
    console.log('=== Debug Conversion ===')

    // Test a simple uninitialized variable declaration
    const code = 'let d;'

    console.log('Original code:')
    console.log(code)

    // Parse with acorn to see the AST
    try {
        const ast = acorn.parse(code, { ecmaVersion: 'latest' })
        console.log('\nAST:')
        console.log(JSON.stringify(ast, null, 2))

        // Convert to JEON
        const jeon = js2jeon(code)
        console.log('\nJEON:')
        console.log(JSON.stringify(jeon, null, 2))

        // Assertions
        expect(ast).toBeDefined()
        expect(jeon).toBeDefined()
    } catch (e: any) {
        console.log('Error:', e.message)
        console.log(e.stack)
        throw e
    }
})