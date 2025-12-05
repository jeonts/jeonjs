// Consolidated Function Tests
// This file consolidates similar function test cases from functionTest.test.ts, functionExpressionTest.test.ts, and test-function-expression.test.ts
import { expect, test } from '@woby/chk'
import * as acorn from 'acorn'
import jsx from 'acorn-jsx'
import { jeon2js } from '../jeon2js'

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

            console.log('✅ Function expression AST structure test PASSED')
        } catch (error: any) {
            expect(error).toBeUndefined() // This will fail and show the error
        }
    })
})

// Test function expressions with JEON
const functionExpressionTestCases = [
    {
        name: 'Function expression with no parameters and closure disabled',
        jeon: {
            'function()': {
                'return': 'Hello World'
            }
        },
        expectedContains: ['function()', 'return', 'Hello World']
    },
    {
        name: 'Function expression with parameters and closure enabled',
        jeon: {
            'function(x)': {
                'return': { '+': ['Hello World', '@x'] }
            }
        },
        expectedContains: ['function(x)', 'return', 'Hello World']
    }
]

test('Function Expression JEON Tests', () => {
    functionExpressionTestCases.forEach(({ name, jeon, expectedContains }) => {
        test(`${name}`, () => {
            console.log(`\n=== ${name} ===`)

            // Convert JEON to JS
            // Cast to any to avoid type issues
            const result = jeon2js(jeon as any, { closure: name.includes('closure enabled') })
            console.log(result)

            // Check for expected elements
            expectedContains.forEach(element => {
                if (typeof element === 'string') {
                    expect(result).toContain(element)
                }
            })

            console.log(`✅ ${name} PASSED`)
        })
    })
})

console.log('🎉 All consolidated function tests completed!')