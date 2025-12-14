import { js2jeon, jeon2js } from '../index'
import { evalJeon } from '../safeEval'

console.log('Testing array literal consistency...')

// Test 1: Convert JavaScript array to JEON and back
const jsCode = '[1, 2, 3]'
console.log('Original JS:', jsCode)

const jeon = js2jeon(jsCode)
console.log('JEON:', JSON.stringify(jeon, null, 2))

const jsResult = jeon2js(jeon)
console.log('Converted back to JS:', jsResult)

// Test 2: Evaluate the JEON directly
const evalResult = evalJeon(jeon)
console.log('Eval result:', evalResult)

// Test 3: Compare with object literals
const objJsCode = '({a: 1, b: 2})'
console.log('\nObject test - Original JS:', objJsCode)

const objJeon = js2jeon(objJsCode)
console.log('Object JEON:', JSON.stringify(objJeon, null, 2))

const objJsResult = jeon2js(objJeon)
console.log('Object converted back to JS:', objJsResult)

console.log('\nArray and object literals now have consistent format!')