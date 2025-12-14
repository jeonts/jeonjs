import { evalJeon } from '../safeEval'

console.log('Comprehensive Operator Tests\n')

// Test all bitwise operators
console.log('1. Bitwise Operators:')
console.log('  15 & 9 =', evalJeon({ '&': [15, 9] })) // Expected: 9 (1111 & 1001 = 1001)
console.log('  15 | 9 =', evalJeon({ '|': [15, 9] })) // Expected: 15 (1111 | 1001 = 1111)
console.log('  15 ^ 9 =', evalJeon({ '^': [15, 9] })) // Expected: 6 (1111 ^ 1001 = 0110)
console.log('  ~15 =', evalJeon({ '~': 15 })) // Expected: -16

// Test all bitwise shift operators
console.log('\n2. Bitwise Shift Operators:')
console.log('  16 << 2 =', evalJeon({ '<<': [16, 2] })) // Expected: 64
console.log('  16 >> 2 =', evalJeon({ '>>': [16, 2] })) // Expected: 4
console.log('  -16 >> 2 =', evalJeon({ '>>': [-16, 2] })) // Expected: -4
console.log('  -16 >>> 2 =', evalJeon({ '>>>': [-16, 2] })) // Expected: 1073741820

// Test compound assignment operators
console.log('\n3. Compound Assignment Operators:')
const context = { x: 20, y: 10, z: 5 }
console.log('  Initial values: x=20, y=10, z=5')

evalJeon({ '+=': ['@x', 5] }, context)
console.log('  x += 5 => x =', context.x) // Expected: 25

evalJeon({ '-=': ['@y', 3] }, context)
console.log('  y -= 3 => y =', context.y) // Expected: 7

evalJeon({ '*=': ['@z', 4] }, context)
console.log('  z *= 4 => z =', context.z) // Expected: 20

evalJeon({ '/=': ['@x', 5] }, context)
console.log('  x /= 5 => x =', context.x) // Expected: 5

evalJeon({ '%=': ['@y', 3] }, context)
console.log('  y %= 3 => y =', context.y) // Expected: 1

// Test shift assignment operators
evalJeon({ '<<=': ['@z', 1] }, context)
console.log('  z <<= 1 => z =', context.z) // Expected: 40

evalJeon({ '>>=': ['@z', 2] }, context)
console.log('  z >>= 2 => z =', context.z) // Expected: 10

// Test bitwise assignment operators
const context2 = { a: 15, b: 9, c: 12 }
console.log('\n  Initial values: a=15, b=9, c=12')

evalJeon({ '&=': ['@a', 7] }, context2)
console.log('  a &= 7 => a =', context2.a) // Expected: 7 (1111 & 0111 = 0111)

evalJeon({ '|=': ['@b', 6] }, context2)
console.log('  b |= 6 => b =', context2.b) // Expected: 15 (1001 | 0110 = 1111)

evalJeon({ '^=': ['@c', 10] }, context2)
console.log('  c ^= 10 => c =', context2.c) // Expected: 6 (1100 ^ 1010 = 0110)

// Test unary operators
console.log('\n4. Unary Operators:')
console.log('  typeof "hello" =', evalJeon({ 'typeof': 'hello' })) // Expected: "string"
console.log('  typeof 42 =', evalJeon({ 'typeof': 42 })) // Expected: "number"
console.log('  void "hello" =', evalJeon({ 'void': 'hello' })) // Expected: undefined

// Test increment/decrement operators
console.log('\n5. Increment/Decrement Operators:')
const context3 = { counter: 5 }
console.log('  Initial counter =', context3.counter)

const originalValue = evalJeon({ '++': '@counter' }, context3)
console.log('  ++counter returns', originalValue, 'and counter is now', context3.counter) // Expected: 5, 6

evalJeon({ '--': '@counter' }, context3)
console.log('  --counter => counter =', context3.counter) // Expected: 5

console.log('\nAll comprehensive tests completed successfully!')