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
  test('Converts JS to JEON and back with JSON5 support using direct normalized string comparison', () => {
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

    // Normalize both codes for comparison
    const normalizedOriginal = normalizeJs(testCode)
    const normalizedRegenerated = normalizeJs(regeneratedCode)

    console.log('\n=== Normalized Comparison ===')
    console.log('Original:', normalizedOriginal)
    console.log('Regenerated:', normalizedRegenerated)

    // Direct normalized string comparison
    expect(normalizedRegenerated).toBe(normalizedOriginal)

    console.log('\n=== Round-trip Test Result ===')
    console.log('✅ Round-trip test PASSED - Direct normalized string comparison successful')
    console.log('Original length:', normalizedOriginal.length)
    console.log('Regenerated length:', normalizedRegenerated.length)
  })
})