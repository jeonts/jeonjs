import { evalJeon } from '../safeEval'

console.log('=== Simple Unary Operator Tests ===\n')

// Test 1: Unary minus
console.log('Test 1: Unary minus')
const result1 = evalJeon({ '-': '@a' }, { a: 5 })
console.log('Result:', result1, 'Expected: -5', 'Match:', result1 === -5 ? '✅' : '❌')

// Test 2: Unary plus
console.log('\nTest 2: Unary plus')
const result2 = evalJeon({ '+': '@a' }, { a: -5 })
console.log('Result:', result2, 'Expected: -5', 'Match:', result2 === -5 ? '✅' : '❌')

// Test 3: Logical NOT
console.log('\nTest 3: Logical NOT')
const result3 = evalJeon({ '!': '@a' }, { a: true })
console.log('Result:', result3, 'Expected: false', 'Match:', result3 === false ? '✅' : '❌')

// Test 4: Complex expression: -a + -b
console.log('\nTest 4: Complex expression: -a + -b')
const result4 = evalJeon({
    '+': [
        { '-': '@a' },
        { '-': '@b' }
    ]
}, { a: 6, b: 7 })
console.log('Result:', result4, 'Expected: -13', 'Match:', result4 === -13 ? '✅' : '❌')

// Test 5: Function body with return
console.log('\nTest 5: Function body with return')
const result5 = evalJeon([
    {
        return: {
            '+': [
                { '-': '@a' },
                { '-': '@b' }
            ]
        }
    }
], { a: 6, b: 7 })
console.log('Result:', result5, 'Expected: -13', 'Match:', result5 === -13 ? '✅' : '❌')