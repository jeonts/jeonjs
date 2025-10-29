import { js2jeon } from './js2jeon'
import { jeon2js } from './jeon2js'
import JSON5 from 'json5'

// Create a JSON-like interface for JSON5
const JSON5Wrapper = {
  stringify: JSON5.stringify,
  parse: JSON5.parse,
  [Symbol.toStringTag]: 'JSON'
}

// Test object spread operator
const spreadCode = `let a = {1:2, 2:3, ...{3:3, 4:4}, 5:5};`

console.log('=== Testing Object Spread Operator ===')
console.log('Original code:')
console.log(spreadCode)

try {
  // Test with standard JSON
  console.log('\n--- Testing with Standard JSON ---')
  const jeonWithStandardJSON = js2jeon(spreadCode)
  console.log('\nJEON with Standard JSON:')
  console.log(JSON.stringify(jeonWithStandardJSON, null, 2))

  const regeneratedWithStandardJSON = jeon2js(jeonWithStandardJSON)
  console.log('\nRegenerated code with Standard JSON:')
  console.log(regeneratedWithStandardJSON)

  // Test with JSON5
  console.log('\n--- Testing with JSON5 ---')
  const jeonWithJSON5 = js2jeon(spreadCode, { json: JSON5Wrapper })
  console.log('\nJEON with JSON5:')
  console.log(JSON5.stringify(jeonWithJSON5, null, 2))

  const regeneratedWithJSON5 = jeon2js(jeonWithJSON5, { json: JSON5Wrapper })
  console.log('\nRegenerated code with JSON5:')
  console.log(regeneratedWithJSON5)

  console.log('\n✅ Object spread operator test completed successfully!')
} catch (error) {
  console.error('\n❌ Error in object spread operator test:', error)
}