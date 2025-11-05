// Import the test framework
import { expect, test } from '@woby/chk'

// Import the function to test
import { evalJeon } from '../safeEval'

test('Primitive values', () => {
    expect(evalJeon(42)).toBe(42)
    expect(evalJeon('hello')).toBe('hello')
    expect(evalJeon(true)).toBe(true)
    expect(evalJeon(null)).toBe(null)
})

test('Variable references', () => {
    const context = { x: 10, y: 5 }
    expect(evalJeon('@x', context)).toBe(10)
    expect(evalJeon('@y', context)).toBe(5)
})

test('Arithmetic operations', () => {
    // Addition
    expect(evalJeon({ '+': [1, 2, 3] })).toBe(6)

    // Subtraction
    expect(evalJeon({ '-': [10, 3, 2] })).toBe(5)

    // Multiplication
    expect(evalJeon({ '*': [2, 3, 4] })).toBe(24)

    // Division
    expect(evalJeon({ '/': [20, 2, 5] })).toBe(2)

    // Modulo
    expect(evalJeon({ '%': [10, 3] })).toBe(1)

    // Negation
    expect(evalJeon({ '-': [5] })).toBe(-5)
})

test('Comparison operations', () => {
    expect(evalJeon({ '==': [5, 5] })).toBe(true)
    expect(evalJeon({ '===': [5, '5'] })).toBe(false)
    expect(evalJeon({ '!=': [5, 3] })).toBe(true)
    expect(evalJeon({ '!==': [5, '5'] })).toBe(true)
    expect(evalJeon({ '<': [3, 5] })).toBe(true)
    expect(evalJeon({ '>': [5, 3] })).toBe(true)
    expect(evalJeon({ '<=': [5, 5] })).toBe(true)
    expect(evalJeon({ '>=': [5, 5] })).toBe(true)
})

test('Logical operations', () => {
    expect(evalJeon({ '&&': [true, true, false] })).toBe(false)
    expect(evalJeon({ '||': [false, false, true] })).toBe(true)
    expect(evalJeon({ '!': true })).toBe(false)
    expect(evalJeon({ '!': false })).toBe(true)
})

test('Conditional expressions', () => {
    expect(evalJeon({ '?': [true, 'yes', 'no'] })).toBe('yes')
    expect(evalJeon({ '?': [false, 'yes', 'no'] })).toBe('no')
})

test('Member access', () => {
    // Test Math.abs using the new generic member access
    const context = { Math }
    const memberAccessExpr = {
        '.': ['@Math', 'abs']
    }
    expect(evalJeon(memberAccessExpr, context)).toBe(Math.abs)
})

test('Complex expressions with context', () => {
    const context = { a: 10, b: 5, c: 2, Math }
    expect(evalJeon({ '+': ['@a', { '*': ['@b', '@c'] }] }, context)).toBe(20)
    expect(evalJeon({ '?': [{ '>': ['@a', '@b'] }, 'greater', 'less'] }, context)).toBe('greater')
})

test('Object literals', () => {
    const result = evalJeon({
        name: 'John',
        age: { '+': [20, 5] },
        active: true
    })
    expect(result).toEqual({
        name: 'John',
        age: 25,
        active: true
    })
})

test('Array literals', () => {
    const result = evalJeon([
        1,
        { '+': [2, 3] },
        'test'
    ])
    expect(result).toEqual([1, 5, 'test'])
})

test('Function calls with JEON format', () => {
    const context = { a: 3, b: 4, Math }

    // Test Math.abs(a + b) in JEON format
    const functionCallExpr = {
        '()': [
            {
                '.': ['@Math', 'abs']
            },
            {
                '+': ['@a', '@b']
            }
        ]
    }

    expect(evalJeon(functionCallExpr as any, context)).toBe(7)

    // Test Math.max(a, b) in JEON format
    const maxFunctionCallExpr = {
        '()': [
            {
                '.': ['@Math', 'max']
            },
            '@a',
            '@b'
        ]
    }

    expect(evalJeon(maxFunctionCallExpr as any, context)).toBe(4)
})

test('New operator', () => {
    // Test creating a new Date object
    const context = { Date }
    const newExpr = {
        'new': ['@Date']
    }
    const result = evalJeon(newExpr, context)
    console.log('New operator result:', result)
    console.log('Is instance of Date:', result instanceof Date)
    expect(result instanceof Date).toBe(true)
})

test('Spread operator', () => {
    const spreadExpr = {
        '...': [1, 2, 3]
    }
    expect(evalJeon(spreadExpr)).toEqual([1, 2, 3])
})

test('If statement', () => {
    const context = { x: 5 }
    const ifExpr = {
        'if': [
            { '>': ['@x', 3] },
            'greater',
            'less'
        ]
    }
    expect(evalJeon(ifExpr, context)).toBe('greater')
})

test('Variable assignment', () => {
    const context: Record<string, any> = { x: 5 }
    const assignExpr = {
        '=': ['y', { '+': ['@x', 2] }]
    }
    expect(evalJeon(assignExpr, context)).toBe(7)
    expect(context['y']).toBe(7)
})
