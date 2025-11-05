import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'

console.log('=== JEON Parentheses Support Examples ===\n')

// Example 1: Empty object in parentheses
console.log('Example 1: Empty object in parentheses')
const code1 = '({})'
const jeon1 = js2jeon(code1)
console.log(`JavaScript: ${code1}`)
console.log(`JEON:`, JSON.stringify(jeon1, null, 2))
const back1 = jeon2js(jeon1)
console.log(`Back to JavaScript: ${back1}\n`)

// Example 2: Binary expression in parentheses
console.log('Example 2: Binary expression in parentheses')
const code2 = '(1+2)'
const jeon2 = js2jeon(code2)
console.log(`JavaScript: ${code2}`)
console.log(`JEON:`, JSON.stringify(jeon2, null, 2))
const back2 = jeon2js(jeon2)
console.log(`Back to JavaScript: ${back2}\n`)

// Example 3: Nested parentheses
console.log('Example 3: Nested parentheses')
const code3 = '((1+2))'
const jeon3 = js2jeon(code3)
console.log(`JavaScript: ${code3}`)
console.log(`JEON:`, JSON.stringify(jeon3, null, 2))
const back3 = jeon2js(jeon3)
console.log(`Back to JavaScript: ${back3}\n`)

console.log('All examples completed successfully!')