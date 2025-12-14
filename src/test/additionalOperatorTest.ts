import { evalJeon } from '../safeEval'

console.log('Additional Operator Tests\n')

// Test function* operator (generator function)
console.log('1. Generator Function Operator:')
try {
    const result = evalJeon({ 'function*': [] })
    console.log('  function* operator result:', typeof result) // Expected: "function"
    console.log('  Is generator function:', result.constructor.name === 'GeneratorFunction')
} catch (error) {
    console.log('  function* operator error:', (error as Error).message)
}

// Test await operator (should throw error outside async context)
console.log('\n2. Await Operator:')
try {
    evalJeon({ 'await': 5 })
} catch (error) {
    console.log('  await operator error (expected):', (error as Error).message)
}

// Test comment operators
console.log('\n3. Comment Operators:')
console.log('  Line comment result:', evalJeon({ '//': 'This is a comment' })) // Expected: undefined
console.log('  Block comment result:', evalJeon({ '/ /': { pattern: 'This is a block comment', flags: '' } })) // Expected: undefined

console.log('\nAdditional tests completed!')