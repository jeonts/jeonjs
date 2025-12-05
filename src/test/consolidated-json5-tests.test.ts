// Consolidated JSON5 Tests
// This file consolidates similar JSON5 test cases from json5RoundTrip.test.ts and json5RoundTripTest.test.ts
import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import JSON5 from '@mainnet-pat/json5-bigint'
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

// JSON5 test cases
const json5TestCases = [
  {
    name: 'JSON5 Round-trip Test',
    code: testCode,
    expectedElements: [
      'function greet(name)',
      'return ("Hello, " + name)',
      '"special-key": "value"',
      '"another.key": "another value"',
      '"unicode🔑": "unicode value"',
      '"trailingComma": "value"',
      'const arr = [1, 2, 3]',
      'console.log(greet(obj.special-key))'
    ]
  },
  {
    name: 'JSON5 Feature Test',
    code: `
const config = {
  name: "My App",
  version: "1.0.0",
  description: 'A sample application',
  features: [
    "feature1",
    "feature2",
    "feature3",
  ],
  port: 3000,
  timeout: Infinity,
  database: {
    host: "localhost",
    port: 5432,
  },
};

function process(config) {
  return config.name + " v" + config.version;
}
`,
    expectedElements: [
      'const config =',
      '"name": "My App"',
      '"version": "1.0.0"',
      'function process(config)'
    ]
  }
]

test('JSON5 Tests', () => {
  json5TestCases.forEach(({ name, code, expectedElements }) => {
    test(`${name}`, () => {
      console.log(`=== ${name} ===`)
      console.log('Original JavaScript Code:')
      console.log(code)

      // Convert JS to JEON with JSON5
      const jeon = js2jeon(code, { json: JSON5Wrapper })
      expect(jeon).toBeDefined()
      expect(typeof jeon).toBe('object')

      const jeonString = JSON5.stringify(jeon, null, 2)
      console.log('\nJEON representation:')
      console.log(jeonString)

      // Convert JEON back to JS with JSON5
      const regeneratedCode = jeon2js(jeon, { json: JSON5Wrapper })
      expect(regeneratedCode).toBeDefined()
      expect(typeof regeneratedCode).toBe('string')

      console.log('\nRegenerated JavaScript Code:')
      console.log(regeneratedCode)

      // Check for expected elements in the regenerated code
      expectedElements.forEach(element => {
        expect(regeneratedCode).toContain(element)
      })

      console.log(`\n✅ ${name} PASSED - Key element comparison successful`)
    })
  })
})

// Comparison test between standard JSON and JSON5
test('JSON5 Comparison Test', () => {
  test('Compares JS to JEON conversion with Standard JSON and JSON5', () => {
    console.log('=== JSON5 Comparison Test ===')
    console.log('Original code:')
    console.log(testCode)

    // Test with standard JSON
    const jeonStandard = js2jeon(testCode)
    expect(jeonStandard).toBeDefined()
    expect(typeof jeonStandard).toBe('object')

    // Test with JSON5
    const jeonJSON5 = js2jeon(testCode, { json: JSON5Wrapper })
    expect(jeonJSON5).toBeDefined()
    expect(typeof jeonJSON5).toBe('object')

    // Convert back with standard JSON
    const regeneratedStandard = jeon2js(jeonStandard)
    expect(regeneratedStandard).toBeDefined()
    expect(typeof regeneratedStandard).toBe('string')

    // Convert back with JSON5
    const regeneratedJSON5 = jeon2js(jeonJSON5, { json: JSON5Wrapper })
    expect(regeneratedJSON5).toBeDefined()
    expect(typeof regeneratedJSON5).toBe('string')

    // Check for key elements
    const expectedElements = [
      'function greet(name)',
      '"special-key": "value"',
      '"another.key": "another value"',
      '"unicode🔑": "unicode value"'
    ]

    expectedElements.forEach(element => {
      expect(regeneratedStandard).toContain(element)
      expect(regeneratedJSON5).toContain(element)
    })

    console.log('✅ Key element checks PASSED for both JSON options')

    console.log('JSON5 test - Original:', testCode.substring(0, 100) + '...')
    console.log('JSON5 test - Standard JEON output length:', JSON.stringify(jeonStandard).length)
    console.log('JSON5 test - JSON5 JEON output length:', JSON5.stringify(jeonJSON5).length)
  })
})

console.log('🎉 All consolidated JSON5 tests completed!')