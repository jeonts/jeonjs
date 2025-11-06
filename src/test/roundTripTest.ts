import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'

const jsCode = `function sum(a, b) {
  return Math.abs(-a + -b);
}`

console.log('Original JS:')
console.log(jsCode)
console.log()

// Convert JS to JEON
const jeon = js2jeon(jsCode)
console.log('JEON:')
console.log(JSON.stringify(jeon, null, 2))
console.log()

// Convert JEON back to JS
const convertedJs = jeon2js(jeon)
console.log('Converted JS:')
console.log(convertedJs)
console.log()

// Check if they match
if (jsCode === convertedJs) {
    console.log('✅ Round-trip test PASSED')
} else {
    console.log('❌ Round-trip test FAILED')
    console.log('Differences:')
    console.log('Original:', JSON.stringify(jsCode))
    console.log('Converted:', JSON.stringify(convertedJs))
}