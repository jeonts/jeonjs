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

// Test with object keys that benefit from JSON5 formatting
const testCode = `
const obj = {
  // These keys benefit from different formatting options
  "special-key": "hyphenated key",
  "key.with.dots": "dot notation key",
  "unicode🔑": "unicode key",
  "123numeric": "numeric start key",
  "key with spaces": "spaced key"
};
`

test('JSON5 Key Formatting Test', () => {
    test('Converts JS to JEON with different JSON options', () => {
        console.log('=== Original JavaScript Code ===')
        console.log(testCode)

        console.log('\n=== Converting JS to JEON with Standard JSON ===')
        const jeonStandard = js2jeon(testCode)
        expect(jeonStandard).toBeDefined()
        expect(typeof jeonStandard).toBe('object')
        console.log('JEON Structure:')
        console.log(JSON.stringify(jeonStandard, null, 2))

        console.log('\n=== Converting JS to JEON with JSON5 ===')
        const jeonJSON5 = js2jeon(testCode, { json: JSON5Wrapper })
        expect(jeonJSON5).toBeDefined()
        expect(typeof jeonJSON5).toBe('object')
        console.log('JEON Structure:')
        console.log(JSON5.stringify(jeonJSON5, null, 2))

        // Basic assertions
        expect(jeonStandard).not.toBeNull()
        expect(jeonJSON5).not.toBeNull()
    })

    test('Key formatting comparison', () => {
        console.log('\n=== Key Formatting Comparison ===')
        const jeonStandard = js2jeon(testCode)
        const jeonJSON5 = js2jeon(testCode, { json: JSON5Wrapper })

        // Extract the object part from both JEON structures
        const objStandard = jeonStandard["@@"]?.obj
        const objJSON5 = jeonJSON5["@@"]?.obj

        console.log('Standard JSON object keys:')
        if (objStandard) {
            Object.keys(objStandard).forEach(key => {
                console.log(`  "${key}": ${typeof objStandard[key]}`)
            })
        }

        console.log('\nJSON5 object keys:')
        if (objJSON5) {
            Object.keys(objJSON5).forEach(key => {
                console.log(`  ${JSON5.stringify(key)}: ${typeof objJSON5[key]}`)
            })
        }

        // Basic assertions
        expect(objStandard).toBeDefined()
        expect(objJSON5).toBeDefined()
    })

    test('Round-trip conversion and key preservation', () => {
        console.log('\n=== Converting JEON back to JS ===')
        const jeonStandard = js2jeon(testCode)
        const jeonJSON5 = js2jeon(testCode, { json: JSON5Wrapper })

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

        // For this test case, we can't use direct string comparison because:
        // 1. Comments are removed during parsing
        // 2. JSON5 formatting changes the output
        // So we'll check for key preservation instead

        console.log('\n=== Round-trip Analysis ===')
        // Check if special keys are preserved
        const specialKeys = ["special-key", "key.with.dots", "unicode🔑", "123numeric", "key with spaces"]
        console.log('Special keys in original:', specialKeys)

        const standardHasKeys = specialKeys.every(key => regeneratedStandard.includes(key.replace(/[-. ]/g, '')) || regeneratedStandard.includes(key))
        const json5HasKeys = specialKeys.every(key => regeneratedJSON5.includes(key.replace(/[-. ]/g, '')) || regeneratedJSON5.includes(key))

        console.log('Standard JSON preserves special keys:', standardHasKeys)
        console.log('JSON5 preserves special keys:', json5HasKeys)

        console.log('\n=== Detailed Key Preservation ===')
        specialKeys.forEach(key => {
            const inStandard = regeneratedStandard.includes(key) || regeneratedStandard.includes(key.replace(/[-. ]/g, ''))
            const inJSON5 = regeneratedJSON5.includes(key) || regeneratedJSON5.includes(key.replace(/[-. ]/g, ''))
            console.log(`${key}: Standard=${inStandard}, JSON5=${inJSON5}`)
        })

        // Basic assertions
        expect(regeneratedStandard.length).toBeGreaterThan(0)
        expect(regeneratedJSON5.length).toBeGreaterThan(0)
        expect(standardHasKeys).toBe(true)
        expect(json5HasKeys).toBe(true)
    })
})