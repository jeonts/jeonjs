import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'

// Simple test without woby dependencies
console.log('=== Round-trip Conversion Fixes ===\n')

// Test 1: Multiple variable declarations should be grouped
console.log('1. Testing multiple variable declarations:')
const js1 = 'let c, d, e;'
console.log(`JavaScript: ${js1}`)
const jeon1 = js2jeon(js1)
console.log(`JEON:`, JSON.stringify(jeon1, null, 2))
const back1 = jeon2js(jeon1)
console.log(`Back to JavaScript: ${back1}\n`)

// Test 2: Delete operator
console.log('2. Testing delete operator:')
const js2 = 'const z = {a:2,b:5,d:1}; delete z.d;'
console.log(`JavaScript: ${js2}`)
const jeon2 = js2jeon(js2)
console.log(`JEON:`, JSON.stringify(jeon2, null, 2))
const back2 = jeon2js(jeon2)
console.log(`Back to JavaScript: ${back2}\n`)

// Test 3: Uninitialized variables with sentinel value
console.log('3. Testing uninitialized variables with sentinel value:')
const jeon3 = {
    "@": {
        "c": "@undefined",
        "d": "@undefined",
        "e": "@undefined"
    }
}
console.log(`JEON:`, JSON.stringify(jeon3, null, 2))
const back3 = jeon2js(jeon3)
console.log(`Back to JavaScript: ${back3}\n`)

console.log('All tests completed!')