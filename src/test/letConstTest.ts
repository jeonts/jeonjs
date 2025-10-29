import { jeon2js } from '../jeon2js'
import { js2jeon } from '../js2jeon'

console.log('=== Testing let and const declarations ===')

// Test 1: let declaration
const letJS = 'let count = 5;'
console.log('Original JS (let):', letJS)

const letJEON = js2jeon(letJS)
console.log('Converted to JEON:')
console.log(JSON.stringify(letJEON, null, 2))

const regeneratedLetJS = jeon2js(letJEON)
console.log('Converted back to JS:')
console.log(regeneratedLetJS)

console.log('\n' + '='.repeat(50) + '\n')

// Test 2: const declaration
const constJS = 'const name = "John";'
console.log('Original JS (const):', constJS)

const constJEON = js2jeon(constJS)
console.log('Converted to JEON:')
console.log(JSON.stringify(constJEON, null, 2))

const regeneratedConstJS = jeon2js(constJEON)
console.log('Converted back to JS:')
console.log(regeneratedConstJS)

console.log('\n' + '='.repeat(50) + '\n')

// Test 3: Multiple declarations
const multipleJS = 'let a = 1; const b = 2; let c = 3;'
console.log('Original JS (multiple):', multipleJS)

const multipleJEON = js2jeon(multipleJS)
console.log('Converted to JEON:')
console.log(JSON.stringify(multipleJEON, null, 2))

const regeneratedMultipleJS = jeon2js(multipleJEON)
console.log('Converted back to JS:')
console.log(regeneratedMultipleJS)

console.log('\n' + '='.repeat(50) + '\n')

// Test 4: Direct JEON with @@ for const
console.log('=== Testing direct JEON with @@ for const ===')
const directConstJEON = {
    "@@": {
        "PI": 3.14159
    }
}
console.log('Direct JEON with @@:')
console.log(JSON.stringify(directConstJEON, null, 2))

const directConstJS = jeon2js(directConstJEON)
console.log('Converted to JS:')
console.log(directConstJS)

console.log('\n' + '='.repeat(50) + '\n')

// Test 5: Direct JEON with @ for let
console.log('=== Testing direct JEON with @ for let ===')
const directLetJEON = {
    "@": {
        "counter": 0
    }
}
console.log('Direct JEON with @:')
console.log(JSON.stringify(directLetJEON, null, 2))

const directLetJS = jeon2js(directLetJEON)
console.log('Converted to JS:')
console.log(directLetJS)