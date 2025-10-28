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

// Test JavaScript code with special characters that benefit from JSON5
const testCode = `
function greet(name) {
  return "Hello, " + name;
}

const obj = {
  "special-key": "value",
  "another.key": "another value",
  "unicode🔑": "unicode value",
  // This is a comment (JSON5 feature)
  trailingComma: "value",
};

// Array with trailing comma (JSON5 feature)
const arr = [
  1,
  2,
  3,
];

console.log(greet(obj["special-key"]));
`

test('JSON5 Round-trip Test', () => {
  test('Converts JS to JEON and back with JSON5 support using key element checks', () => {
    console.log('=== Original JavaScript Code ===')
    console.log(testCode)

    // Convert JS to JEON with JSON5
    const jeon = js2jeon(testCode, { json: JSON5Wrapper })
    expect(jeon).toBeDefined()
    expect(typeof jeon).toBe('object')

    const jeonString = JSON5.stringify(jeon, null, 2)
    console.log('\n=== JEON representation ===')
    console.log(jeonString)

    // Convert JEON back to JS with JSON5
    const regeneratedCode = jeon2js(jeon, { json: JSON5Wrapper })
    expect(regeneratedCode).toBeDefined()
    expect(typeof regeneratedCode).toBe('string')

    console.log('\n=== Regenerated JavaScript Code ===')
    console.log(regeneratedCode)

    // Check for key elements in the regenerated code rather than direct string comparison
    // because comments are removed during the conversion process
    expect(regeneratedCode).toContain('function greet(name)')
    expect(regeneratedCode).toContain('return ("Hello, " + name)')
    expect(regeneratedCode).toContain('"special-key": "value"')
    expect(regeneratedCode).toContain('"another.key": "another value"')
    expect(regeneratedCode).toContain('"unicode🔑": "unicode value"')
    expect(regeneratedCode).toContain('"trailingComma": "value"')
    expect(regeneratedCode).toContain('const arr = [1, 2, 3]')
    expect(regeneratedCode).toContain('console.log(greet(obj.special-key))')

    console.log('\n=== Round-trip Test Result ===')
    console.log('✅ Round-trip test PASSED - Key element comparison successful')
  })
})