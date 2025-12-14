import { js2jeon } from './src/js2jeon'
import { evalJeon } from './src/safeEval'

// Test case30
const testCode = `
class Calculator {
static add(a, b){
    return a+b
}
static multiply(a, b) {
    return a*b
}
}
Calculator.add(1,4) + Calculator.multiply(1,4)
`

console.log('Testing case30...')
try {
    const jeon = js2jeon(testCode, { iife: true })
    const result = evalJeon(jeon)
    console.log('Result:', result)
    console.log('Expected: 5')
    console.log('Test passed:', result === 5 ? 'YES' : 'NO')
} catch (error: any) {
    console.error('Error:', error.message)
}