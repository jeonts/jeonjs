// Consolidated test suite for JEON converter
import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { evalJeon } from '../safeEval'

// Test primitive values
test('Primitive values', () => {
    expect(evalJeon(42)).toBe(42)
    expect(evalJeon('hello')).toBe('hello')
    expect(evalJeon(true)).toBe(true)
    expect(evalJeon(null)).toBe(null)
})

// Test variable references
test('Variable references', () => {
    const context = { x: 10, y: 5 }
    expect(evalJeon('@x', context)).toBe(10)
    expect(evalJeon('@y', context)).toBe(5)
})

// Test all arithmetic operators
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

    // Unary plus
    expect(evalJeon({ '+': [5] })).toBe(5)
})

// Test all comparison operators
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

// Test all logical operators
test('Logical operations', () => {
    expect(evalJeon({ '&&': [true, true, false] })).toBe(false)
    expect(evalJeon({ '||': [false, false, true] })).toBe(true)
    expect(evalJeon({ '!': true })).toBe(false)
    expect(evalJeon({ '!': false })).toBe(true)
})

// Test unary operators
test('Unary operators', () => {
    expect(evalJeon({ '~': [0] })).toBe(-1)
    expect(evalJeon({ 'typeof': 'hello' })).toBe('string')
    expect(evalJeon({ 'typeof': 42 })).toBe('number')
    expect(evalJeon({ 'typeof': true })).toBe('boolean')
})

// Test conditional expressions
test('Conditional expressions', () => {
    expect(evalJeon({ '?': [true, 'yes', 'no'] })).toBe('yes')
    expect(evalJeon({ '?': [false, 'yes', 'no'] })).toBe('no')
})

// Test member access
test('Member access', () => {
    const context = { Math }
    const memberAccessExpr = {
        '.': ['@Math', 'abs']
    }
    expect(evalJeon(memberAccessExpr, context)).toBe(Math.abs)
})

// Test complex expressions with context
test('Complex expressions with context', () => {
    const context = { a: 10, b: 5, c: 2, Math }
    expect(evalJeon({ '+': ['@a', { '*': ['@b', '@c'] }] }, context)).toBe(20)
    expect(evalJeon({ '?': [{ '>': ['@a', '@b'] }, 'greater', 'less'] }, context)).toBe('greater')
})

// Test object literals
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

// Test array literals
test('Array literals', () => {
    const result = evalJeon([
        1,
        { '+': [2, 3] },
        'test'
    ])
    // Arrays are evaluated as statement sequences, returning the last statement's result
    expect(result).toBe('test')
})

// Test function calls with JEON format
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

// Test new operator
test('New operator', () => {
    // Test creating a new Date object
    const context = { Date }
    const newExpr = {
        'new': ['@Date']
    }
    const result = evalJeon(newExpr, context)
    expect(result instanceof Date).toBe(true)
})

// Test spread operator
test('Spread operator', () => {
    const spreadExpr = {
        '...': [1, 2, 3]
    }
    const result = evalJeon(spreadExpr)
    // Spread operator evaluates to the value itself
    expect(JSON.stringify(result)).toBe(JSON.stringify([1, 2, 3]))
})

// Test if statement
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

// Test variable assignment
test('Variable assignment', () => {
    const context: Record<string, any> = { x: 5 }
    const assignExpr = {
        '=': ['y', { '+': ['@x', 2] }]
    }
    expect(evalJeon(assignExpr, context)).toBe(7)
    expect(context['y']).toBe(7)
})

// Test all JeonExpression operators via js2jeon -> evalJeon
test('All JeonExpression operators via conversion', () => {
    // Arithmetic operators
    const arithmeticTests = [
        { code: '1 + 2', expected: 3 },
        { code: '5 - 3', expected: 2 },
        { code: '4 * 3', expected: 12 },
        { code: '10 / 2', expected: 5 },
        { code: '10 % 3', expected: 1 }
    ]

    for (const test of arithmeticTests) {
        const jeon = js2jeon(test.code)
        const result = evalJeon(jeon)
        expect(result).toBe(test.expected)
    }

    // Comparison operators
    const comparisonTests = [
        { code: '5 == 5', expected: true },
        { code: '5 === 5', expected: true },
        { code: '5 != 3', expected: true },
        { code: '5 !== "5"', expected: true },
        { code: '3 < 5', expected: true },
        { code: '5 > 3', expected: true },
        { code: '3 <= 3', expected: true },
        { code: '5 >= 5', expected: true }
    ]

    for (const test of comparisonTests) {
        const jeon = js2jeon(test.code)
        const result = evalJeon(jeon)
        expect(result).toBe(test.expected)
    }

    // Logical operators
    const logicalTests = [
        { code: 'true && true', expected: true },
        { code: 'true && false', expected: false },
        { code: 'false || true', expected: true },
        { code: 'false || false', expected: false },
        { code: '!true', expected: false },
        { code: '!false', expected: true }
    ]

    for (const test of logicalTests) {
        const jeon = js2jeon(test.code)
        const result = evalJeon(jeon)
        expect(result).toBe(test.expected)
    }

    // Unary operators
    const unaryTests = [
        { code: '+5', expected: 5 },
        { code: '-5', expected: -5 },
        { code: '~0', expected: -1 },
        { code: 'typeof "hello"', expected: 'string' }
    ]

    for (const test of unaryTests) {
        const jeon = js2jeon(test.code)
        const result = evalJeon(jeon)
        expect(result).toBe(test.expected)
    }
})

// Test control flow constructs
test('Control flow constructs', () => {
    // Conditional (ternary) operator
    const ternaryCode = 'true ? "yes" : "no"'
    const ternaryJeon = js2jeon(ternaryCode)
    const ternaryResult = evalJeon(ternaryJeon)
    expect(ternaryResult).toBe('yes')
})

// Test function declarations and calls
test('Function declarations and calls', () => {
    // Function call with JEON
    const context = { Math }
    const callExpr = {
        '()': [
            { '.': ['@Math', 'abs'] },
            -5
        ]
    }
    const callResult = evalJeon(callExpr, context)
    expect(callResult).toBe(5)
})

// Test complex nested expressions
test('Complex nested expressions', () => {
    // Complex arithmetic with parentheses
    const complexCode = '(2 + 3) * (4 - 1) + Math.max(5, 6)'
    const context = { Math }
    const complexJeon = js2jeon(complexCode)
    const complexResult = evalJeon(complexJeon, context)
    expect(complexResult).toBe(21) // (5) * (3) + 6 = 15 + 6 = 21

    // Nested function calls
    const nestedCode = 'Math.max(Math.min(5, 10), 3)'
    const nestedJeon = js2jeon(nestedCode)
    const nestedResult = evalJeon(nestedJeon, context)
    expect(nestedResult).toBe(5) // Math.max(5, 3) = 5

    // Complex conditional
    const complexConditionalCode = 'true ? (false ? "a" : "b") : "c"'
    const complexConditionalJeon = js2jeon(complexConditionalCode)
    const complexConditionalResult = evalJeon(complexConditionalJeon)
    expect(complexConditionalResult).toBe('b')
})

// Test object and array operations
test('Object and array operations', () => {
    // Property access
    const propAccessCode = 'Math.PI'
    const context = { Math }
    const propAccessJeon = js2jeon(propAccessCode)
    const propAccessResult = evalJeon(propAccessJeon, context)
    expect(propAccessResult).toBe(Math.PI)
})

// Test closure mode
test('Closure mode conversion', () => {
    const code = 'function add(a, b) { return a + b; }'
    const jeon = js2jeon(code)

    // Regular conversion
    const regularJs = jeon2js(jeon)

    // Closure mode conversion
    const closureJs = jeon2js(jeon, { closure: true })

    expect(typeof regularJs).toBe('string')
    expect(typeof closureJs).toBe('string')
})

// Test round-trip conversion with evaluation
test('Complete round-trip: js2jeon -> jeon2js -> evalJeon', () => {
    // Simple expression
    const originalCode = '2 + 3 * 4'
    const jeon = js2jeon(originalCode)
    const convertedJs = jeon2js(jeon)
    const result = evalJeon(jeon)

    expect(result).toBe(14) // 2 + (3 * 4) = 2 + 12 = 14
    expect(typeof jeon).toBe('object')
    expect(typeof convertedJs).toBe('string')

    // More complex expression
    const complexCode = 'Math.max(10, 5) + Math.min(3, 7)'
    const complexContext = { Math }
    const complexJeon = js2jeon(complexCode)
    const complexConvertedJs = jeon2js(complexJeon)
    const complexResult = evalJeon(complexJeon, complexContext)

    expect(complexResult).toBe(13) // 10 + 3 = 13
    expect(typeof complexJeon).toBe('object')
    expect(typeof complexConvertedJs).toBe('string')
})

// Complex nested test cases
test('Deeply nested arithmetic expressions', () => {
    // Complex nested arithmetic with multiple levels of parentheses
    const complexCode = '(((2 + 3) * (4 - 1)) + ((5 / 2) % 2)) * (Math.max(3, 4) - 1)'
    const context = { Math }
    const jeon = js2jeon(complexCode)
    const result = evalJeon(jeon, context)

    // Calculation:
    // (((2 + 3) * (4 - 1)) + ((5 / 2) % 2)) * (Math.max(3, 4) - 1)
    // (((5) * (3)) + ((2.5) % 2)) * (4 - 1)
    // ((15) + (0.5)) * (3)
    // (15.5) * (3)
    // 46.5
    expect(result).toBe(46.5)
})

test('Nested function calls with complex arguments', () => {
    const complexFunctionCode = `
    Math.max(
      Math.min(10, 20), 
      Math.floor(15.7), 
      Math.abs(-5) + Math.sqrt(16)
    )
  `
    const context = { Math }
    const jeon = js2jeon(complexFunctionCode)
    const result = evalJeon(jeon, context)

    // Calculation:
    // Math.max(Math.min(10, 20), Math.floor(15.7), Math.abs(-5) + Math.sqrt(16))
    // Math.max(10, 15, 5 + 4)
    // Math.max(10, 15, 9)
    // 15
    expect(result).toBe(15)
})

test('Nested conditional expressions', () => {
    const nestedConditionalCode = `
    true 
      ? (false ? "a" : (true ? "b" : "c")) 
      : (true ? "d" : "e")
  `
    const jeon = js2jeon(nestedConditionalCode)
    const result = evalJeon(jeon)

    // Evaluation:
    // true ? (false ? "a" : (true ? "b" : "c")) : (true ? "d" : "e")
    // (false ? "a" : (true ? "b" : "c"))
    // (true ? "b" : "c")
    // "b"
    expect(result).toBe("b")
})

test('Deeply nested ternary operators', () => {
    const deepTernaryCode = `
    true ? 
      (false ? 
        (true ? 
          (false ? "a" : "b") : 
          (true ? "c" : "d")
        ) : 
        (false ? "e" : "f")
      ) : 
      (true ? "g" : "h")
  `
    const jeon = js2jeon(deepTernaryCode)
    const result = evalJeon(jeon)
    expect(result).toBe("f")
})

test('Complex mathematical expression with functions', () => {
    const mathCode = `
    Math.pow(
      Math.sqrt(16) + Math.abs(-3), 
      Math.min(2, 3)
    ) - Math.floor(Math.PI)
  `
    const context = { Math }
    const jeon = js2jeon(mathCode)
    const result = evalJeon(jeon, context)

    // Calculation:
    // Math.pow(Math.sqrt(16) + Math.abs(-3), Math.min(2, 3)) - Math.floor(Math.PI)
    // Math.pow(4 + 3, 2) - 3
    // Math.pow(7, 2) - 3
    // 49 - 3
    // 46
    expect(result).toBe(46)
})

console.log('🎉 All consolidated tests completed!')