import { js2jeon } from './src/js2jeon'
import { evalJeon } from './src/safeEval'

// Test case31 specifically
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

console.log('Verifying case31 fix...')
console.log('Code:')
console.log(code)

try {
    const jeon = js2jeon(code, { iife: true })
    console.log('\nGenerated JEON structure processed successfully')

    const result = evalJeon(jeon)
    console.log('\nResult:', result)

    if (result === 9) {
        console.log('✅ SUCCESS: case31 is now working correctly!')
        console.log('✅ Destructuring static methods from class constructors works!')
    } else {
        console.log('❌ FAILURE: Expected 9, got', result)
    }
} catch (error: any) {
    console.error('❌ ERROR:', error.message)
    console.error(error.stack)
}