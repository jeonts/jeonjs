import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Debug Destructuring ===\n')

// Simple destructuring test
console.log('--- Testing simple destructuring ---')
try {
  const code = `
const obj = { a: 1, b: 2 };
const { a, b } = obj;
a + b
`
  console.log('Code:')
  console.log(code)
  const jeon = js2jeon(code, { iife: true })
  console.log('JEON:')
  console.log(JSON.stringify(jeon, null, 2))
  const result = evalJeon(jeon)
  console.log('Result:', result)
  console.log('✅ Success\n')
} catch (error: any) {
  console.error('❌ Error:', error.message)
  console.log('')
}

// Even simpler test
console.log('--- Testing even simpler destructuring ---')
try {
  const code2 = `
const obj = { a: 1, b: 2 };
const { a, b } = obj;
`
  console.log('Code:')
  console.log(code2)
  const jeon2 = js2jeon(code2, { iife: true })
  console.log('JEON:')
  console.log(JSON.stringify(jeon2, null, 2))
  const result2 = evalJeon(jeon2)
  console.log('Result:', result2)
  console.log('✅ Success\n')
} catch (error: any) {
  console.error('❌ Error:', error.message)
  console.log('')
}