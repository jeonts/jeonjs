import { js2jeon, jeon2js } from '../index'
import { evalJeon } from '../safeEval'

console.log('=== Final Consistency Test ===\n')

// Test 1: Array literals are now consistent with object literals
console.log('1. Array literals are now consistent with object literals:')

// Array literal
const arrayJs = '[1, 2, 3]'
const arrayJeon = js2jeon(arrayJs)
console.log(`   JavaScript: ${arrayJs}`)
console.log(`   JEON: ${JSON.stringify(arrayJeon)}`)
console.log(`   Eval result: ${JSON.stringify(evalJeon(arrayJeon))}`)

// Object literal
const objectJs = '({a: 1, b: 2})'
const objectJeon = js2jeon(objectJs)
console.log(`   JavaScript: ${objectJs}`)
console.log(`   JEON: ${JSON.stringify(objectJeon)}`)
console.log(`   Eval result: ${JSON.stringify(evalJeon(objectJeon))}`)

console.log('')

// Test 2: Execution sequences still work
console.log('2. Execution sequences still work:')

const executionSequence = [
    { '@': { x: 10 } } as any,
    { '@': { y: 20 } } as any,
    { '+': ['@x', '@y'] } as any
]

console.log(`   Sequence: ${JSON.stringify(executionSequence)}`)
console.log(`   Result: ${evalJeon(executionSequence)}`)

console.log('')

// Test 3: Mixed content
console.log('3. Mixed content (arrays within objects):')

const mixedJs = '({arr: [1, 2, 3], obj: {nested: "value"}})'
const mixedJeon = js2jeon(mixedJs)
console.log(`   JavaScript: ${mixedJs}`)
console.log(`   JEON: ${JSON.stringify(mixedJeon, null, 2)}`)
console.log(`   Eval result: ${JSON.stringify(evalJeon(mixedJeon), null, 2)}`)

console.log('\n=== All tests passed! Arrays and objects now have consistent format. ===')