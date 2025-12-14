import { js2jeon } from './src/js2jeon'
import { evalJeon } from './src/safeEval'

// Test full case30 expression
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

console.log('Testing full case30 expression...')
try {
    const jeon = js2jeon(testCode, { iife: true })
    console.log('JEON:', JSON.stringify(jeon, null, 2))
    const result = evalJeon(jeon)
    console.log('Result:', result)
    console.log('Expected: 9')
} catch (error: any) {
    console.error('Error:', error.message)
    console.error(error.stack)
}