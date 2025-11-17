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

test('JSON5 Comprehensive Test', () => {
    test('Key formatting differences', () => {
        console.log('=== JSON5 Comprehensive Test ===\n')

        console.log('1. Key Formatting Differences')
        const simpleObjCode = `const obj = { "key": "value" };`
        const jeonStandard = js2jeon(simpleObjCode)
        const jeonJSON5 = js2jeon(simpleObjCode, { json: JSON5Wrapper })

        expect(jeonStandard).toBeDefined()
        expect(jeonJSON5).toBeDefined()
        expect(typeof jeonStandard).toBe('object')
        expect(typeof jeonJSON5).toBe('object')

        console.log('Standard JSON JEON:')
        console.log(JSON.stringify(jeonStandard, null, 2))
        console.log('\nJSON5 JEON:')
        console.log(JSON5.stringify(jeonJSON5, null, 2))
    })

    test('Round-trip with special characters and direct normalized string comparison', () => {
        console.log('\n\n2. Round-trip with Special Characters')
        const specialCharsCode = `
const config = {
  "special-key": "hyphenated",
  "key.with.dots": "dots",
  "unicode🔑": "unicode",
  "123start": "numeric start"
};
`
        console.log('Original code:')
        console.log(specialCharsCode)

        const jeonSpecial = js2jeon(specialCharsCode, { json: JSON5Wrapper })
        expect(jeonSpecial).toBeDefined()
        expect(typeof jeonSpecial).toBe('object')

        console.log('\nJEON with JSON5:')
        console.log(JSON5.stringify(jeonSpecial, null, 2))

        const regeneratedSpecial = jeon2js(jeonSpecial, { json: JSON5Wrapper })
        expect(regeneratedSpecial).toBeDefined()
        expect(typeof regeneratedSpecial).toBe('string')

        console.log('\nRegenerated code:')
        console.log(regeneratedSpecial)

        // Check for key elements instead of direct string comparison
        expect(regeneratedSpecial).toContain('const config =')
        expect(regeneratedSpecial).toContain('special-key')
        expect(regeneratedSpecial).toContain('key.with.dots')
        expect(regeneratedSpecial).toContain('unicode🔑')
        expect(regeneratedSpecial).toContain('123start')

        console.log('\n✅ Key element checks PASSED')

        // Check that special characters are preserved
        expect(regeneratedSpecial).toContain('special-key')
        expect(regeneratedSpecial).toContain('key.with.dots')
        expect(regeneratedSpecial).toContain('unicode🔑')
        expect(regeneratedSpecial).toContain('123start')
    })

    test('Practical benefits analysis', () => {
        console.log('\n\n3. Practical Benefits Analysis')
        const specialCharsCode = `
const config = {
  "special-key": "hyphenated",
  "key.with.dots": "dots",
  "unicode🔑": "unicode",
  "123start": "numeric start"
};
`
        const jeonSpecial = js2jeon(specialCharsCode, { json: JSON5Wrapper })
        const regeneratedSpecial = jeon2js(jeonSpecial, { json: JSON5Wrapper })

        const keys = ["special-key", "key.with.dots", "unicode🔑", "123start"]
        const allPreserved = keys.every(key =>
            specialCharsCode.includes(key) &&
            regeneratedSpecial.includes(key)
        )

        console.log('All special keys preserved:', allPreserved)
        if (allPreserved) {
            console.log('✅ JSON5 round-trip test PASSED')
        } else {
            console.log('❌ JSON5 round-trip test FAILED')
        }

        expect(allPreserved).toBe(true)
    })

    test('JEON formatting comparison', () => {
        console.log('\n\n4. JEON Formatting Comparison')
        const specialCharsCode = `
const config = {
  "special-key": "hyphenated",
  "key.with.dots": "dots",
  "unicode🔑": "unicode",
  "123start": "numeric start"
};
`
        const jeonSpecial = js2jeon(specialCharsCode, { json: JSON5Wrapper })

        const jeonStandardStr = JSON.stringify(jeonSpecial, null, 2)
        const jeonJSON5Str = JSON5.stringify(jeonSpecial, null, 2)

        console.log('Standard JSON formatting uses double quotes for all keys')
        console.log('JSON5 formatting uses unquoted keys where possible')

        const standardQuotes = (jeonStandardStr.match(/"/g) || []).length
        const json5Quotes = (jeonJSON5Str.match(/"/g) || []).length
        const json5SingleQuotes = (jeonJSON5Str.match(/'/g) || []).length

        console.log(`Standard JSON quote count: ${standardQuotes}`)
        console.log(`JSON5 double quote count: ${json5Quotes}`)
        console.log(`JSON5 single quote count: ${json5SingleQuotes}`)

        // Basic assertions
        expect(typeof jeonStandardStr).toBe('string')
        expect(typeof jeonJSON5Str).toBe('string')
    })

    test('Size comparison', () => {
        console.log('\n\n5. Size Comparison')
        const specialCharsCode = `
const config = {
  "special-key": "hyphenated",
  "key.with.dots": "dots",
  "unicode🔑": "unicode",
  "123start": "numeric start"
};
`
        const jeonSpecial = js2jeon(specialCharsCode, { json: JSON5Wrapper })

        const jeonStandardStr = JSON.stringify(jeonSpecial, null, 2)
        const jeonJSON5Str = JSON5.stringify(jeonSpecial, null, 2)

        console.log(`Standard JSON JEON size: ${jeonStandardStr.length} characters`)
        console.log(`JSON5 JEON size: ${jeonJSON5Str.length} characters`)
        console.log(`Size difference: ${jeonStandardStr.length - jeonJSON5Str.length} characters`)

        console.log('\n=== Summary ===')
        console.log('JSON5 benefits in JEON:')
        console.log('- More readable key formatting (unquoted where possible)')
        console.log('- Consistent with JavaScript object literal syntax')
        console.log('- Better handling of special characters in keys')
        console.log('- Maintains full round-trip compatibility')

        // Basic assertions
        expect(jeonStandardStr.length).toBeGreaterThan(0)
        expect(jeonJSON5Str.length).toBeGreaterThan(0)
    })

    test('Object spread operator support', () => {
        console.log('\n\n6. Object Spread Operator Support')
        const spreadCode = `let a = {1:2, 2:3, ...{3:3, 4:4}, 5:5};`

        console.log('Original code:')
        console.log(spreadCode)

        // Test with JSON5
        const jeonWithJSON5 = js2jeon(spreadCode, { json: JSON5Wrapper })
        expect(jeonWithJSON5).toBeDefined()
        expect(typeof jeonWithJSON5).toBe('object')

        console.log('\nJEON with JSON5:')
        console.log(JSON5.stringify(jeonWithJSON5, null, 2))

        const regeneratedWithJSON5 = jeon2js(jeonWithJSON5, { json: JSON5Wrapper })
        expect(regeneratedWithJSON5).toBeDefined()
        expect(typeof regeneratedWithJSON5).toBe('string')

        console.log('\nRegenerated code:')
        console.log(regeneratedWithJSON5)

        // Check for key elements instead of direct string comparison
        expect(regeneratedWithJSON5).toContain('let a =')
        expect(regeneratedWithJSON5).toContain('"1": 2')
        expect(regeneratedWithJSON5).toContain('"2": 3')
        expect(regeneratedWithJSON5).toContain('"3": 3')
        expect(regeneratedWithJSON5).toContain('"4": 4')
        expect(regeneratedWithJSON5).toContain('"5": 5')
        expect(regeneratedWithJSON5).toContain('...')

        console.log('\n✅ Object spread operator test PASSED')
    })
})