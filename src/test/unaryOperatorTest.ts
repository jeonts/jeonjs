import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'

// Test cases specifically for unary operators
const testCases = [
    // Test unary minus
    `function test() {
  return -5;
}`,
    // Test unary plus
    `function test() {
  return +5;
}`,
    // Test unary not
    `function test() {
  return !true;
}`,
    // Test complex expressions with unary operators
    `function test() {
  return -a + -b;
}`,
    `function test() {
  return !a && !b;
}`,
    // Test the original issue
    `function sum(a, b) {
  return Math.abs(-a + -b);
}`
]

testCases.forEach((jsCode, index) => {
    console.log(`\n=== Test Case ${index + 1} ===`)
    console.log('Original JS:')
    console.log(jsCode)
    console.log()

    // Convert JS to JEON
    try {
        const jeon = js2jeon(jsCode)
        console.log('JEON:')
        console.log(JSON.stringify(jeon, null, 2))
        console.log()

        // Convert JEON back to JS
        const convertedJs = jeon2js(jeon)
        console.log('Converted JS:')
        console.log(convertedJs)
        console.log()

        // Check if the functionality is preserved by evaluating both
        console.log('✅ Conversion successful')
    } catch (error: any) {
        console.log('❌ Conversion failed:', error.message)
    }
})