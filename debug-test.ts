import { js2jeon } from './src/js2jeon'
import { evalJeon } from './src/safeEval'

const code = `
class Calculator {
  static add(a, b){
    return a+b
  }
  static multiply(a, b) {
    return a*b
  }
}
const {add, multiply} = Calculator
add(1,4) + multiply(1,4)
`

console.log('Original code:')
console.log(code)

const jeon = js2jeon(code, { iife: true })
console.log('\nGenerated JEON:')
console.log(JSON.stringify(jeon, null, 2))

console.log('\nEvaluating JEON...')
try {
    const result = evalJeon(jeon)
    console.log('Result:', result)
} catch (error: any) {
    console.error('Error:', error.message)
    console.error(error.stack)
}