mport { evalJeon } from '../safeEval'

// Test bitwise operators
console.log('Testing bitwise operators:')
console.log('5 & 3 =', evalJeon({ '&': [5, 3] }))
console.log('5 | 3 =', evalJeon({ '|': [5, 3] }))
console.log('5 ^ 3 =', evalJeon({ '^': [5, 3] }))
console.log('~5 =', evalJeon({ '~': 5 }))

// Test bitwise shift operators
console.log('\nTesting bitwise shift operators:')
console.log('5 << 1 =', evalJeon({ '<<': [5, 1] }))
console.log('5 >> 1 =', evalJeon({ '>>': [5, 1] }))
console.log('5 >>> 1 =', evalJeon({ '>>>': [5, 1] }))

// Test unary operators
console.log('\nTesting unary operators:')
console.log('typeof 5 =', evalJeon({ 'typeof': 5 }))
console.log('void 5 =', evalJeon({ 'void': 5 }))

// Test increment/decrement operators
console.log('\nTesting increment/decrement operators:')
const context1 = { x: 5 }
console.log('x = 5')
evalJeon({ '++': '@x' }, context1)
console.log('++x =', context1.x)

const context2 = { y: 5 }
console.log('y = 5')
evalJeon({ '--': '@y' }, context2)
console.log('--y =', context2.y)

// Test compound assignment operators
console.log('\nTesting compound assignment operators:')
const context3 = { a: 10 }
console.log('a = 10')
evalJeon({ '+=': ['@a', 5] }, context3)
console.log('a += 5 => a =', context3.a)

const context4 = { b: 10 }
console.log('b = 10')
evalJeon({ '-=': ['@b', 5] }, context4)
console.log('b -= 5 => b =', context4.b)

console.log('\nAll tests completed successfully!')