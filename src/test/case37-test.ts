import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Testing Case 37: Object Destructuring ===\n')

const case37 = `
const {a,b} = {a:1, b:3}
a+b
`

console.log('Code:')
console.log(case37)

// Test with iife option
console.log('\n--- With iife: true ---')
try {
  const jeon = js2jeon(case37, { iife: true })
  console.log('JEON:')
  console.log(JSON.stringify(jeon, null, 2))
  
  const result = evalJeon(jeon)
  console.log('Result:', result)
  console.log('✅ Success')
} catch (error: any) {
  console.error('❌ Error:', error.message)
}

// Test without iife option for comparison
console.log('\n--- Without iife option (for comparison) ---')
try {
  const jeon = js2jeon(case37)
  console.log('JEON:')
  console.log(JSON.stringify(jeon, null, 2))
  
  const result = evalJeon(jeon)
  console.log('Result:', result)
  console.log('✅ Success')
} catch (error: any) {
  console.error('❌ Error:', error.message)
}