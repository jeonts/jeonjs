import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Debug Empty Object Handling ===\n')

// Test empty object
console.log('--- Testing empty object {} ---')
try {
  const code = '{}'
  console.log('Code:', code)
  const jeon = js2jeon(code, { iife: true })
  console.log('JEON:', JSON.stringify(jeon, null, 2))
  const result = evalJeon(jeon)
  console.log('Result:', result)
  console.log('Type of result:', typeof result)
  console.log('✅ Success\n')
} catch (error: any) {
  console.error('❌ Error:', error.message)
  console.log('')
}

// Test non-empty object
console.log('--- Testing non-empty object {a:1} ---')
try {
  const code2 = '{a:1}'
  console.log('Code:', code2)
  const jeon2 = js2jeon(code2, { iife: true })
  console.log('JEON:', JSON.stringify(jeon2, null, 2))
  const result2 = evalJeon(jeon2)
  console.log('Result:', result2)
  console.log('Type of result:', typeof result2)
  console.log('✅ Success\n')
} catch (error: any) {
  console.error('❌ Error:', error.message)
  console.log('')
}