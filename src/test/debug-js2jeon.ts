import { js2jeon } from '../js2jeon'

console.log('=== Debug js2jeon Output ===\n')

// Test various object cases
const testCases = [
  '{}',
  '{a:1}',
  '{a:1, b:2}',
  '[]',
  '[1, 2]',
  '"hello"',
  '123',
  'true',
  'null',
  'undefined'
]

for (const code of testCases) {
  console.log(`--- Testing ${code} ---`)
  try {
    const jeon = js2jeon(code, { iife: true })
    console.log('JEON:', JSON.stringify(jeon, null, 2))
    console.log('')
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    console.log('')
  }
}