import { evalJeon } from '../safeEval'

// Test basic arithmetic operations
console.log('Testing basic arithmetic operations:')

// Test addition
const result1 = evalJeon({ '+': [2, 3] })
console.log('2 + 3 =', result1)

// Test subtraction
const result2 = evalJeon({ '-': [5, 2] })
console.log('5 - 2 =', result2)

// Test multiplication
const result3 = evalJeon({ '*': [3, 4] })
console.log('3 * 4 =', result3)

// Test division
const result4 = evalJeon({ '/': [10, 2] })
console.log('10 / 2 =', result4)

// Test modulo
const result5 = evalJeon({ '%': [10, 3] })
console.log('10 % 3 =', result5)

// Test equality
const result6 = evalJeon({ '==': [5, 5] })
console.log('5 == 5 =', result6)

// Test strict equality
const result7 = evalJeon({ '===': [5, 5] })
console.log('5 === 5 =', result7)

// Test inequality
const result8 = evalJeon({ '!=': [5, 3] })
console.log('5 != 3 =', result8)

// Test strict inequality
const result9 = evalJeon({ '!==': [5, '5'] })
console.log("5 !== '5' =", result9)

// Test less than
const result10 = evalJeon({ '<': [3, 5] })
console.log('3 < 5 =', result10)

// Test greater than
const result11 = evalJeon({ '>': [5, 3] })
console.log('5 > 3 =', result11)

// Test less than or equal
const result12 = evalJeon({ '<=': [3, 3] })
console.log('3 <= 3 =', result12)

// Test greater than or equal
const result13 = evalJeon({ '>=': [5, 5] })
console.log('5 >= 5 =', result13)

// Test logical AND
const result14 = evalJeon({ '&&': [true, true] })
console.log('true && true =', result14)

// Test logical OR
const result15 = evalJeon({ '||': [false, true] })
console.log('false || true =', result15)

// Test logical NOT
const result16 = evalJeon({ '!': true })
console.log('!true =', result16)

// Test bitwise NOT
const result17 = evalJeon({ '~': 5 })
console.log('~5 =', result17)

// Test typeof
const result18 = evalJeon({ 'typeof': 5 })
console.log("typeof 5 =", result18)

console.log('All tests completed.')