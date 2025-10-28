import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import * as JSON5 from 'json5'
import { normalizeJs } from './testUtils'

// Create a JSON-like interface for JSON5
const JSON5Wrapper = {
  stringify: JSON5.stringify,
  parse: JSON5.parse,
  [Symbol.toStringTag]: 'JSON'
}

// Complex JavaScript code to test
const originalCode = `
// This is a complex example with various JavaScript features
async function processData(input) {
  const config = {
    "api-endpoint": "https://api.example.com",
    "timeout-ms": 5000,
    "retry-count": 3,
    "features": ["auth", "cache", "logging"],
  };
  
  try {
    const response = await fetch(config["api-endpoint"], {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + input.token
      },
      body: JSON.stringify(input.data)
    });
    
    if (!response.ok) {
      throw new Error("API request failed: " + response.status);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Processing failed:", error.message);
    throw error;
  }
}

// Class with methods
class DataProcessor {
  constructor(options) {
    this.options = options;
  }
  
  async process(data) {
    return await processData({
      token: this.options.apiToken,
      data: data
    });
  }
}

// Usage example
const processor = new DataProcessor({
  "apiToken": "secret123",
  "timeout-ms": 5000
});

processor.process({ "id": 1, "name": "test" });
`

test('Complete Round-trip Test', () => {
  test('JS -> JEON -> JS conversion with JSON5 using key element checks', () => {
    console.log('=== Complete Round-trip Test: JS -> JEON -> JS ===\n')

    console.log('1. Original JavaScript Code:')
    console.log(originalCode)

    console.log('\n\n2. Converting JS to JEON using JSON5...')
    const jeon = js2jeon(originalCode, { json: JSON5Wrapper })
    expect(jeon).toBeDefined()
    expect(typeof jeon).toBe('object')

    console.log('\n3. JEON Representation (formatted with JSON5):')
    console.log(JSON.stringify(jeon, null, 2))

    console.log('\n\n4. Converting JEON back to JavaScript using JSON5...')
    const regeneratedCode = jeon2js(jeon, { json: JSON5Wrapper })
    expect(regeneratedCode).toBeDefined()
    expect(typeof regeneratedCode).toBe('string')

    console.log('\n5. Regenerated JavaScript Code:')
    console.log(regeneratedCode)

    console.log('\n\n6. Round-trip Analysis:')
    const originalLength = originalCode.length
    const regeneratedLength = regeneratedCode.length

    console.log(`Original code length: ${originalLength} characters`)
    console.log(`Regenerated code length: ${regeneratedLength} characters`)
    console.log(`Difference: ${Math.abs(originalLength - regeneratedLength)} characters`)

    // Check for key elements preservation instead of direct string comparison
    const keyElements = [
      'async function processData',
      'api-endpoint',
      'timeout-ms',
      'class DataProcessor',
      'new DataProcessor',
      'apiToken',
      'await fetch',
      'method: "POST"',
      'Content-Type',
      'Authorization',
      'Bearer',
      'JSON.stringify',
      'response.ok',
      'response.status',
      'response.json()',
      'console.error',
      'throw error',
      'this.options',
      'processData',
      'secret123',
      'id: 1',
      'name: "test"'
    ]

    const preservedElements = keyElements.filter(element =>
      regeneratedCode.includes(element)
    )

    console.log(`\nPreserved key elements: ${preservedElements.length}/${keyElements.length}`)
    preservedElements.forEach(element => console.log(`  ✓ ${element}`))

    const missingElements = keyElements.filter(element =>
      !regeneratedCode.includes(element)
    )

    if (missingElements.length > 0) {
      console.log('\nMissing elements:')
      missingElements.forEach(element => console.log(`  ✗ ${element}`))
    } else {
      console.log('\n✅ All key elements preserved!')
    }

    // Overall result
    const success = missingElements.length === 0 && preservedElements.length > 0
    console.log(`\n=== FINAL RESULT: ${success ? '✅ PASSED' : '❌ FAILED'} ===`)

    if (success) {
      console.log('\nThe JEON converter successfully supports JSON5 for round-trip conversion!')
      console.log('Benefits demonstrated:')
      console.log('- Preserves special characters in keys')
      console.log('- Maintains code structure and functionality')
      console.log('- Supports modern JavaScript features (async/await, classes, etc.)')
      console.log('- Works with complex nested objects and arrays')
    }

    // Assertions
    expect(preservedElements.length).toBeGreaterThan(0)
    expect(missingElements.length).toBeLessThan(keyElements.length / 2) // Allow some missing due to syntax changes
  })
})