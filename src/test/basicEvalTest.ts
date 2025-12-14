import { evalJeon } from '../safeEval'

// Test basic functionality
console.log('Testing basic evalJeon functionality:')

// Test primitive values
console.log('String:', evalJeon('hello'))
console.log('Number:', evalJeon(42))
console.log('Boolean:', evalJeon(true))
console.log('Null:', evalJeon(null))

// Test array literals
console.log('Array:', evalJeon([1, 2, 3]))

// Test object literals
console.log('Object:', evalJeon({ a: 1, b: 2 }))

// Test variable lookup
const context = { x: 10, y: 20 }
console.log('Variable lookup x:', evalJeon('@x', context))
console.log('Variable lookup y:', evalJeon('@y', context))

// Test simple arithmetic expression
console.log('Arithmetic expression:', evalJeon({ '+': [{ '*': [2, 3] }, 4] }))

console.log('All basic tests completed.')