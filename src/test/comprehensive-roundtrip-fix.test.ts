import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'

// Comprehensive test for round-trip conversion fixes
console.log('=== Comprehensive Round-trip Conversion Fixes ===\n')

// Test 1: Multiple uninitialized variable declarations
console.log('1. Testing multiple uninitialized variable declarations:')
const js1 = 'let c, d, e;'
console.log(`JavaScript: ${js1}`)
const jeon1 = js2jeon(js1)
console.log(`JEON:`, JSON.stringify(jeon1, null, 2))
const back1 = jeon2js(jeon1)
console.log(`Back to JavaScript: ${back1}\n`)

// Test 2: Mixed initialized and uninitialized variable declarations
console.log('2. Testing mixed initialized and uninitialized variable declarations:')
const js2 = 'let a = 1, b, c = 2;'
// This will be converted to separate declarations in JEON format
const jeon2 = [
    {
        "@": {
            "a": 1,
            "b": "@undefined",
            "c": 2
        }
    }
]
console.log(`JEON:`, JSON.stringify(jeon2, null, 2))
const back2 = jeon2js(jeon2)
console.log(`Back to JavaScript: ${back2}\n`)

// Test 3: Delete operator
console.log('3. Testing delete operator:')
const js3 = 'const z = {a:2,b:5,d:1}; delete z.d;'
console.log(`JavaScript: ${js3}`)
const jeon3 = js2jeon(js3)
console.log(`JEON:`, JSON.stringify(jeon3, null, 2))
const back3 = jeon2js(jeon3)
console.log(`Back to JavaScript: ${back3}\n`)

// Test 4: Multiple delete operators
console.log('4. Testing multiple delete operators:')
const js4 = 'const obj = {a:1, b:2, c:3}; delete obj.a; delete obj.b;'
console.log(`JavaScript: ${js4}`)
const jeon4 = js2jeon(js4)
console.log(`JEON:`, JSON.stringify(jeon4, null, 2))
const back4 = jeon2js(jeon4)
console.log(`Back to JavaScript: ${back4}\n`)

// Test 5: Const declarations
console.log('5. Testing const declarations:')
const js5 = 'const x, y, z;'
// This would be invalid JavaScript, but testing the JEON format
const jeon5 = {
    "@@": {
        "x": "@undefined",
        "y": "@undefined",
        "z": "@undefined"
    }
}
console.log(`JEON:`, JSON.stringify(jeon5, null, 2))
const back5 = jeon2js(jeon5)
console.log(`Back to JavaScript: ${back5}\n`)

console.log('All comprehensive tests completed!')