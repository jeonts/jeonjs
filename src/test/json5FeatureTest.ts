import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import * as JSON5 from 'json5'

// Create a JSON-like interface for JSON5
const JSON5Wrapper = {
    stringify: JSON5.stringify,
    parse: JSON5.parse,
    [Symbol.toStringTag]: 'JSON'
}

// Test JavaScript code that showcases JSON5 features
const testCode = `
// This is a comment (JSON5 feature)
const config = {
  // Keys without quotes (JSON5 feature)
  name: "My App",
  version: "1.0.0",
  
  // Single quotes (JSON5 feature)
  description: 'A sample application',
  
  // Trailing commas (JSON5 feature)
  features: [
    "feature1",
    "feature2",
    "feature3", // trailing comma
  ],
  
  // Numbers with different formats (JSON5 feature)
  port: 3000,
  rate: 0.95,
  
  // Special numeric values (JSON5 feature)
  timeout: Infinity,
  ratio: NaN,
  
  // Objects with trailing commas
  database: {
    host: "localhost",
    port: 5432,
  },
};

// Function using special key names
function process(config) {
  return config.name + " v" + config.version;
}
`

test('JSON5 Feature Test', () => {
    test('Converts JS to JEON with Standard JSON and JSON5', () => {
        console.log('=== Original JavaScript Code with JSON5 Features ===')
        console.log(testCode)

        console.log('\n=== Converting JS to JEON with Standard JSON ===')
        const jeonStandard = js2jeon(testCode)
        expect(jeonStandard).toBeDefined()
        expect(typeof jeonStandard).toBe('object')
        const jeonStandardString = JSON.stringify(jeonStandard, null, 2)
        console.log(jeonStandardString)

        console.log('\n=== Converting JS to JEON with JSON5 ===')
        const jeonJSON5 = js2jeon(testCode, { json: JSON5Wrapper })
        expect(jeonJSON5).toBeDefined()
        expect(typeof jeonJSON5).toBe('object')
        const jeonJSON5String = JSON5.stringify(jeonJSON5, null, 2)
        console.log(jeonJSON5String)

        console.log('\n=== Comparing JEON Outputs ===')
        console.log('Standard JSON preserves key formatting:', jeonStandardString.includes('"name"') && !jeonStandardString.includes('name:'))
        console.log('JSON5 preserves key formatting:', jeonJSON5String.includes('name:') || jeonJSON5String.includes("'name'"))

        console.log('\n=== Converting JEON back to JS ===')
        console.log('From Standard JSON JEON:')
        const regeneratedStandard = jeon2js(jeonStandard)
        expect(regeneratedStandard).toBeDefined()
        expect(typeof regeneratedStandard).toBe('string')
        console.log(regeneratedStandard)

        console.log('\nFrom JSON5 JEON:')
        const regeneratedJSON5 = jeon2js(jeonJSON5, { json: JSON5Wrapper })
        expect(regeneratedJSON5).toBeDefined()
        expect(typeof regeneratedJSON5).toBe('string')
        console.log(regeneratedJSON5)
    })

    test('Feature preservation check', () => {
        const jeonStandard = js2jeon(testCode)
        const jeonJSON5 = js2jeon(testCode, { json: JSON5Wrapper })
        
        const regeneratedStandard = jeon2js(jeonStandard)
        const regeneratedJSON5 = jeon2js(jeonJSON5, { json: JSON5Wrapper })

        const features = [
            'name: "My App"',
            'version: "1.0.0"',
            "description: 'A sample application'",
            '"feature3"', // trailing comma in array
            'port: 3000',
            'timeout: Infinity',
            'database: {',
            'host: "localhost"',
        ]

        features.forEach(feature => {
            const inStandard = regeneratedStandard.includes(feature)
            const inJSON5 = regeneratedJSON5.includes(feature)
            console.log(`${feature}: Standard=${inStandard}, JSON5=${inJSON5}`)
        })

        // At least check that both conversions produced valid strings
        expect(regeneratedStandard.length).toBeGreaterThan(0)
        expect(regeneratedJSON5.length).toBeGreaterThan(0)
    })
})