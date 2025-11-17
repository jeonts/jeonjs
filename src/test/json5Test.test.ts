import { expect, test } from '@woby/chk'
import { jeon2js } from '../jeon2js'
import JSON5 from '@mainnet-pat/json5-bigint'

// Create a JSON-like interface for JSON5
const JSON5Wrapper = {
  stringify: JSON5.stringify,
  parse: JSON5.parse,
  [Symbol.toStringTag]: 'JSON'
}

// Test with special characters in keys that JSON5 can handle better
const testJeon = {
  "@": {
    "special-key": "value",
    "another.key": "another value",
    "unicode🔑": "unicode value"
  }
}

test('JSON5 Test', () => {
  test('Converts JEON to JS with different JSON options', () => {
    console.log('=== Testing with default JSON ===')
    const result1 = jeon2js(testJeon)
    expect(result1).toBeDefined()
    expect(typeof result1).toBe('string')
    console.log(result1)

    console.log('\n=== Testing with JSON5 ===')
    const result2 = jeon2js(testJeon, { json: JSON5Wrapper })
    expect(result2).toBeDefined()
    expect(typeof result2).toBe('string')
    console.log(result2)

    // Basic assertions
    expect(result1.length).toBeGreaterThan(0)
    expect(result2.length).toBeGreaterThan(0)
  })
})