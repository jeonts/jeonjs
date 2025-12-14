import { js2jeon } from './src/js2jeon'
import { evalJeon } from './src/safeEval'

// Test property access directly
const testCode = `
class Calculator {
  static add(a, b){
    return a+b
  }
}
Calculator.add
`

console.log('Testing property access...')
try {
    const jeon = js2jeon(testCode, { iife: true })
    console.log('JEON:', JSON.stringify(jeon, null, 2))
    const result = evalJeon(jeon)
    console.log('Result:', result)
    console.log('Type of result:', typeof result)
} catch (error: any) {
    console.error('Error:', error.message)
    console.error(error.stack)
}