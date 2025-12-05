import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Before and After Demo ===\n')

const testCases = [
  '{}',
  '{a:1}',
  '[1, 2, 3]'
]

for (const code of testCases) {
  console.log(`\n--- Testing: ${code} ---`)
  
  // Without iife option (old behavior)
  console.log('Without iife option:')
  try {
    const jeonOld = js2jeon(code)
    console.log('  JEON:', JSON.stringify(jeonOld))
    const resultOld = evalJeon(jeonOld)
    console.log('  Result:', resultOld)
    console.log('  Type:', typeof resultOld)
  } catch (error: any) {
    console.log('  Error:', error.message)
  }
  
  // With iife option (new behavior)
  console.log('With iife option:')
  try {
    const jeonNew = js2jeon(code, { iife: true })
    console.log('  JEON:', JSON.stringify(jeonNew))
    const resultNew = evalJeon(jeonNew)
    console.log('  Result:', resultNew)
    console.log('  Type:', typeof resultNew)
  } catch (error: any) {
    console.log('  Error:', error.message)
  }
}