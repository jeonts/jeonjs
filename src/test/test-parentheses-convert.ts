import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'

console.log('Testing parentheses support...')

// Test JS to JEON conversion
console.log('\n=== JS to JEON ===')
const code1 = '({})'
const jeon1 = js2jeon(code1)
console.log(`Input: ${code1}`)
console.log(`Output:`, JSON.stringify(jeon1, null, 2))

const code2 = '(1+2)'
const jeon2 = js2jeon(code2)
console.log(`\nInput: ${code2}`)
console.log(`Output:`, JSON.stringify(jeon2, null, 2))

// Test JEON to JS conversion
console.log('\n=== JEON to JS ===')
const jeon3 = {
    '(': {}
}
const code3 = jeon2js(jeon3)
console.log(`Input:`, JSON.stringify(jeon3, null, 2))
console.log(`Output: ${code3}`)

const jeon4 = {
    '(': {
        '+': [1, 2]
    }
}
const code4 = jeon2js(jeon4)
console.log(`\nInput:`, JSON.stringify(jeon4, null, 2))
console.log(`Output: ${code4}`)

// Test round-trip
console.log('\n=== Round-trip test ===')
const originalCode = '(1+2)'
const jeon = js2jeon(originalCode)
const convertedCode = jeon2js(jeon)
console.log(`Original: ${originalCode}`)
console.log(`JEON:`, JSON.stringify(jeon, null, 2))
console.log(`Converted back: ${convertedCode}`)