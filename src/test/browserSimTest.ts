import { expect, test } from '@woby/chk'
import * as JSON5 from 'json5'

test('Browser Environment Simulation', () => {
    test('JSON5 object properties', () => {
        console.log('=== Browser Environment Simulation ===')
        console.log('JSON5 object:', JSON5)
        console.log('typeof JSON5:', typeof JSON5)
        console.log('JSON5.stringify:', typeof JSON5.stringify)
        console.log('JSON5.parse:', typeof JSON5.parse)

        expect(JSON5).toBeDefined()
        expect(typeof JSON5).toBe('object')
        expect(typeof JSON5.stringify).toBe('function')
        expect(typeof JSON5.parse).toBe('function')
    })

    test('JSON5 wrapper functionality', () => {
        // Test creating a wrapper like in the browser
        const JSON5Wrapper = {
            stringify: JSON5.stringify,
            parse: JSON5.parse,
            [Symbol.toStringTag]: 'JSON'
        }

        console.log('\n=== Wrapper Test ===')
        console.log('JSON5Wrapper:', JSON5Wrapper)
        console.log('typeof JSON5Wrapper.stringify:', typeof JSON5Wrapper.stringify)
        console.log('typeof JSON5Wrapper.parse:', typeof JSON5Wrapper.parse)

        expect(typeof JSON5Wrapper.stringify).toBe('function')
        expect(typeof JSON5Wrapper.parse).toBe('function')

        // Test using the wrapper
        try {
            const testObj = { "special-key": "value" }
            const result = JSON5Wrapper.stringify(testObj, null, 2)
            console.log('Wrapper stringify result:', result)

            const parsed = JSON5Wrapper.parse(result)
            console.log('Wrapper parse result:', parsed)

            expect(result).toContain('special-key')
            expect(parsed).toHaveProperty('special-key')
            expect(parsed['special-key']).toBe('value')

            console.log('Test PASSED')
        } catch (error) {
            expect(error).toBeUndefined() // This will fail and show the error
        }
    })
})