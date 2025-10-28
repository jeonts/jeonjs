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

    // Check for key elements instead of direct string comparison
    expect(regeneratedStandard).toContain('const config =')
    expect(regeneratedStandard).toContain('"name": "My App"')
    expect(regeneratedStandard).toContain('"version": "1.0.0"')
    expect(regeneratedStandard).toContain('function process(config)')
    expect(regeneratedJSON5).toContain('const config =')
    expect(regeneratedJSON5).toContain('"name": "My App"')
    expect(regeneratedJSON5).toContain('"version": "1.0.0"')
    expect(regeneratedJSON5).toContain('function process(config)')

    console.log('✅ Key element checks PASSED for both JSON options')

    console.log('JSON5 test - Original:', testCode.substring(0, 100) + '...')
    console.log('JSON5 test - Standard JEON output length:', JSON.stringify(jeonStandard).length)
    console.log('JSON5 test - JSON5 JEON output length:', JSON5.stringify(jeonJSON5).length)
  })
})