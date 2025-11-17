import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import JSON5 from '@mainnet-pat/json5-bigint'

// Create a JSON-like interface for JSON5
const JSON5Wrapper = {
    stringify: JSON5.stringify,
    parse: JSON5.parse,
    [Symbol.toStringTag]: 'JSON'
}

test('Object Spread Operator Test', () => {
    // Test object spread operator
    const spreadCode = `let a = {1:2, 2:3, ...{3:3, 4:4}, 5:5};`

    console.log('=== Testing Object Spread Operator ===')
    console.log('Original code:')
    console.log(spreadCode)

    test('Converts JS with object spread to JEON and back with standard JSON', () => {
        console.log('\n--- Testing with Standard JSON ---')
        try {
            const jeonWithStandardJSON = js2jeon(spreadCode)
            console.log('\nJEON with Standard JSON:')
            console.log(JSON.stringify(jeonWithStandardJSON, null, 2))

            expect(jeonWithStandardJSON).toBeDefined()
            expect(typeof jeonWithStandardJSON).toBe('object')

            const regeneratedWithStandardJSON = jeon2js(jeonWithStandardJSON)
            console.log('\nRegenerated code with Standard JSON:')
            console.log(regeneratedWithStandardJSON)

            expect(regeneratedWithStandardJSON).toBeDefined()
            expect(typeof regeneratedWithStandardJSON).toBe('string')

            console.log('\n✅ Object spread operator test with Standard JSON PASSED')
        } catch (error: any) {
            console.error('\n❌ Error in object spread operator test with Standard JSON:', error)
            expect(error).toBeUndefined()
        }
    })

    test('Converts JS with object spread to JEON and back with JSON5', () => {
        console.log('\n--- Testing with JSON5 ---')
        try {
            const jeonWithJSON5 = js2jeon(spreadCode, { json: JSON5Wrapper })
            console.log('\nJEON with JSON5:')
            console.log(JSON5.stringify(jeonWithJSON5, null, 2))

            expect(jeonWithJSON5).toBeDefined()
            expect(typeof jeonWithJSON5).toBe('object')

            const regeneratedWithJSON5 = jeon2js(jeonWithJSON5, { json: JSON5Wrapper })
            console.log('\nRegenerated code with JSON5:')
            console.log(regeneratedWithJSON5)

            expect(regeneratedWithJSON5).toBeDefined()
            expect(typeof regeneratedWithJSON5).toBe('string')

            // Check that the regenerated code contains the expected elements
            expect(regeneratedWithJSON5).toContain('let a')
            expect(regeneratedWithJSON5).toContain('"1": 2')
            expect(regeneratedWithJSON5).toContain('"2": 3')
            expect(regeneratedWithJSON5).toContain('"3": 3')
            expect(regeneratedWithJSON5).toContain('"4": 4')
            expect(regeneratedWithJSON5).toContain('"5": 5')
            expect(regeneratedWithJSON5).toContain('...')

            console.log('\n✅ Object spread operator test with JSON5 PASSED')
        } catch (error: any) {
            console.error('\n❌ Error in object spread operator test with JSON5:', error)
            expect(error).toBeUndefined()
        }
    })
})