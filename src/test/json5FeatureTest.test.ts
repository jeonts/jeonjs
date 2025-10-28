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

// Test JavaScript code that showcases JSON5 features
const testCode = `
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
`

test('JSON5 Feature Test', () => {
  test('Converts JS to JEON with Standard JSON and JSON5 and direct normalized string comparison', () => {
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

    // Normalize codes for comparison
    const normalizedOriginal = normalizeJs(testCode)
    const normalizedRegeneratedStandard = normalizeJs(regeneratedStandard)
    const normalizedRegeneratedJSON5 = normalizeJs(regeneratedJSON5)

    console.log('=== Normalized Comparison ===')
    console.log('Original:', normalizedOriginal)
    console.log('Standard Regenerated:', normalizedRegeneratedStandard)
    console.log('JSON5 Regenerated:', normalizedRegeneratedJSON5)

    // Direct normalized string comparison
    expect(normalizedRegeneratedStandard).toBe(normalizedOriginal)
    expect(normalizedRegeneratedJSON5).toBe(normalizedOriginal)

    console.log('✅ Direct normalized string comparison PASSED for both JSON options')

    console.log('JSON5 test - Original:', testCode.substring(0, 100) + '...')
    console.log('JSON5 test - Standard JEON output length:', JSON.stringify(jeonStandard).length)
    console.log('JSON5 test - JSON5 JEON output length:', JSON5.stringify(jeonJSON5).length)
  })
})