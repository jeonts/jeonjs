import { expect, test } from '@woby/chk'
import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

// Test parsing error
const invalidAnonymousFunctionCode = `function(name) { return ("Hello, " + name) }`
const validAnonymousFunctionCode = `(function(name) { return ("Hello, " + name) })`

test('Parsing Error Test', () => {
    test('Invalid anonymous function syntax should throw error', () => {
        console.log('=== Testing Invalid Anonymous Function Syntax ===')
        try {
            const Parser = acorn.Parser.extend(jsx())
            const invalidAst = Parser.parse(invalidAnonymousFunctionCode, {
                ecmaVersion: 'latest',
                sourceType: 'module',
                allowReturnOutsideFunction: true
            })
            console.log('Successfully parsed (unexpected):')
            console.log(JSON.stringify(invalidAst, null, 2))
            
            // This should not happen - expect an error
            expect(true).toBe(false)
        } catch (error: any) {
            console.log('Expected parsing error:', error.message)
            expect(error).toBeDefined()
        }
    })

    test('Valid anonymous function syntax should parse successfully', () => {
        console.log('\n=== Testing Valid Anonymous Function Syntax ===')
        try {
            const Parser = acorn.Parser.extend(jsx())
            const validAst = Parser.parse(validAnonymousFunctionCode, {
                ecmaVersion: 'latest',
                sourceType: 'module',
                allowReturnOutsideFunction: true
            })
            console.log('Successfully parsed:')
            console.log(JSON.stringify(validAst.body[0], null, 2))
            
            expect(validAst).toBeDefined()
            expect(validAst.body[0]).toBeDefined()
        } catch (error: any) {
            console.log('Error:', error.message)
            expect(error).toBeUndefined()
        }
    })
})