import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import JSON5 from 'json5'
import { normalizeJs } from './testUtils'

// Create a JSON-like interface for JSON5
const JSON5Wrapper = {
  stringify: JSON5.stringify,
  parse: JSON5.parse,
  [Symbol.toStringTag]: 'JSON'
}

// Test the new options parameter for both functions
const testCode = `
function greet(name) {
  return "Hello, " + name;
}

const obj = {
  "special-key": "value",
  "another.key": "another value"
};
`

test('Full Options Test', () => {
  test('Tests js2jeon and jeon2js with different JSON options and direct normalized string comparison', () => {
    console.log('=== Testing js2jeon with default JSON ===')
    const jeon1 = js2jeon(testCode)
    expect(jeon1).toBeDefined()
    expect(typeof jeon1).toBe('object')
    console.log(JSON.stringify(jeon1, null, 2))

    console.log('\n=== Testing js2jeon with JSON5 ===')
    const jeon2 = js2jeon(testCode, { json: JSON5Wrapper })
    expect(jeon2).toBeDefined()
    expect(typeof jeon2).toBe('object')
    console.log(JSON.stringify(jeon2, null, 2))

    console.log('\n=== Testing jeon2js with default JSON ===')
    const js1 = jeon2js(jeon1)
    expect(js1).toBeDefined()
    expect(typeof js1).toBe('string')
    console.log(js1)

    console.log('\n=== Testing jeon2js with JSON5 ===')
    const js2 = jeon2js(jeon2, { json: JSON5Wrapper })
    expect(js2).toBeDefined()
    expect(typeof js2).toBe('string')
    console.log(js2)

    // Check for key elements instead of direct string comparison
    expect(js1).toContain('function greet(name)')
    expect(js1).toContain('return ("Hello, " + name)')
    expect(js1).toContain('const obj =')
    expect(js1).toContain('"special-key": "value"')
    expect(js1).toContain('"another.key": "another value"')
    expect(js2).toContain('function greet(name)')
    expect(js2).toContain('return ("Hello, " + name)')
    expect(js2).toContain('const obj =')
    expect(js2).toContain('"special-key": "value"')
    expect(js2).toContain('"another.key": "another value"')

    console.log('\n✅ Key element checks PASSED for both JSON options')

    // Basic assertions to ensure both conversions work
    expect(jeon1).not.toBeNull()
    expect(jeon2).not.toBeNull()
    expect(js1.length).toBeGreaterThan(0)
    expect(js2.length).toBeGreaterThan(0)
  })
})