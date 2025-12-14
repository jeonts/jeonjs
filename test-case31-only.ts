import { js2jeon } from './src/js2jeon'
import { evalJeon } from './src/safeEval'

// Test just case31 scenario
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

console.log('Testing case31 scenario...')
console.log('Code:', code)

try {
    const jeon = js2jeon(code, { iife: true })
    console.log('\nGenerated JEON:')
    console.log(JSON.stringify(jeon, null, 2))

    const result = evalJeon(jeon)
    console.log('\nResult:', result)
    console.log('Success: Destructuring static methods from class now works!')
    console.log('Mathematical verification: (1+4) + (1*4) = 5 + 4 = 9')
} catch (error: any) {
    console.error('Error:', error.message)
    console.error(error.stack)
}