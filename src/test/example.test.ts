import { evaluateJeonExpression as evalJeon, js2jeon } from '../index'
import { jeon2js } from '../jeon2js'
import { expect, test } from '@woby/chk'
import { JeonExpression } from '../JeonExpression'

test('JEON expression examples', () => {
    // Example 1: Simple arithmetic
    const arithmeticExpr = { '+': [1, { '*': [2, 3] }, 4] } // 1 + (2 * 3) + 4 = 11
    console.log('Arithmetic result (JEON format):', jeon2js(arithmeticExpr), ' = ', evalJeon(arithmeticExpr))

    // Example 2: Conditional expression
    const conditionalExpr = { '?': [{ '>': [5, 3] }, 'greater', 'less'] }
    console.log('Conditional result (JEON format):', jeon2js(conditionalExpr), ' = ', evalJeon(conditionalExpr))

    // Example 3: Using context variables
    const context = { x: 10, y: 5 }
    const variableExpr = { '*': ['@x', { '+': ['@y', 2] }] } // x * (y + 2) = 10 * 7 = 70
    console.log('Variable expression result (JEON format):', jeon2js(variableExpr), ' = ', evalJeon(variableExpr, context))

    // Example 4: Object with embedded expressions
    const objExpr = {
        name: 'Calculator',
        result: { '+': [1, 2, 3, 4, 5] },
        isActive: { '&&': [true, { '!==': [5, 6] }] }
    }
    console.log('Object expression result (JEON format):', jeon2js(objExpr), ' = ', evalJeon(objExpr))

    // Example 5: Member access
    const contextWithMath = { Math }
    const memberAccessExpr = {
        '.': ['@Math', 'abs']
    }
    console.log('Member access result (JEON format):', jeon2js(memberAccessExpr), ' = ', evalJeon(memberAccessExpr as any, contextWithMath))

    // Example 6: Function calls with JEON format (new format)
    // Math.abs(a + b) where a=3, b=4
    const context2 = { a: 3, b: 4, Math }
    const functionCallExpr: JeonExpression = {
        '()': [
            {
                '.': ['@Math', 'abs']
            },
            {
                '-': ['@a', '@b']
            }
        ]
    } as any
    console.log('Function call result (JEON format):', jeon2js(functionCallExpr), ' = ', evalJeon(functionCallExpr, context2))

    // Example 7: Math.max(a, b) in JEON format
    const maxFunctionCallExpr: JeonExpression = {
        '()': [
            {
                '.': ['@Math', 'max']
            },
            '@a',
            '@b'
        ]
    } as any
    console.log('Math.max result (JEON format):', jeon2js(maxFunctionCallExpr), ' = ', evalJeon(maxFunctionCallExpr, context2))

    // Example 8: New operator
    const contextWithDate = { Date }
    const newExpr: JeonExpression = {
        'new': ['@Date']
    } as any
    console.log('New operator result (JEON format):', jeon2js(newExpr), ' = ', evalJeon(newExpr, contextWithDate))

    // Example 9: Spread operator
    const spreadExpr = {
        '...': [1, 2, 3]
    }
    console.log('Spread operator result (JEON format):', jeon2js(spreadExpr), ' = ', evalJeon(spreadExpr))

    // Example 10: If statement
    const context3 = { x: 5 }
    const ifExpr: JeonExpression = {
        'if': [
            { '>': ['@x', 3] },
            'greater',
            'less'
        ]
    } as any
    console.log('If statement result (JEON format):', jeon2js(ifExpr), ' = ', evalJeon(ifExpr, context3))

    // Example 11: Variable assignment
    const context4: Record<string, any> = { x: 5 }
    const assignExpr: JeonExpression = {
        '=': ['y', { '+': ['@x', 2] }]
    } as any
    console.log('Variable assignment result (JEON format):', jeon2js(assignExpr), ' = ', evalJeon(assignExpr, context4))
    console.log('Context after assignment:', context4)

    console.log('All examples completed!')

    // Assertions
    expect(arithmeticExpr).toBeDefined()
    expect(conditionalExpr).toBeDefined()
    expect(context).toBeDefined()
    expect(variableExpr).toBeDefined()
    expect(objExpr).toBeDefined()
    expect(contextWithMath).toBeDefined()
    expect(memberAccessExpr).toBeDefined()
    expect(context2).toBeDefined()
    expect(functionCallExpr).toBeDefined()
    expect(maxFunctionCallExpr).toBeDefined()
    expect(contextWithDate).toBeDefined()
    expect(newExpr).toBeDefined()
    expect(spreadExpr).toBeDefined()
    expect(context3).toBeDefined()
    expect(ifExpr).toBeDefined()
    expect(context4).toBeDefined()
    expect(assignExpr).toBeDefined()
})