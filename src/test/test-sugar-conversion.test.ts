import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import JSON5 from '@mainnet-pat/json5-bigint'

const code1 = `(function (a, b) {
  abs(a + b)
})`

const code2 = `(function() {
  return this.name
})`

console.log('=== Test 1: Function call ===')
console.log('JavaScript code:')
console.log(code1)
console.log('\nJEON (explicit syntax - no sugar):')
const jeon1 = js2jeon(code1)
console.log(JSON5.stringify(jeon1, null, 2))
console.log('\nConverted back to JavaScript:')
const jsCode1 = jeon2js(jeon1)
console.log(jsCode1)

console.log('\n=== Test 2: Member access (this.name) ===')
console.log('JavaScript code:')
console.log(code2)
console.log('\nJEON:')
const jeon2 = js2jeon(code2)
console.log(JSON5.stringify(jeon2, null, 2))
console.log('\nConverted back to JavaScript:')
const jsCode2 = jeon2js(jeon2)
console.log(jsCode2)
