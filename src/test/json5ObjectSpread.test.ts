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

test('JSON5 Object Spread Operator Test', () => {
    test('Converts JS with object spread to JEON and back with JSON5', () => {
        // Test object spread operator
        const spreadCode = `let a = {1:2, 2:3, ...{3:3, 4:4}, 5:5};`

        console.log('=== Testing Object Spread Operator ===')
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

        // For object spread operators, we'll check for key preservation rather than direct string comparison
        // because the formatting may change during conversion
        expect(regeneratedWithJSON5).toContain('let a')
        expect(regeneratedWithJSON5).toContain('"1": 2')
        expect(regeneratedWithJSON5).toContain('"2": 3')
        expect(regeneratedWithJSON5).toContain('"3": 3')
        expect(regeneratedWithJSON5).toContain('"4": 4')
        expect(regeneratedWithJSON5).toContain('"5": 5')
        expect(regeneratedWithJSON5).toContain('...')

        console.log('\n✅ Object spread operator test PASSED')
    })
})