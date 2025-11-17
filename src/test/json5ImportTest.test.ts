import { expect, test } from '@woby/chk'
import JSON5 from '@mainnet-pat/json5-bigint'

test('JSON5 Import Test', () => {
    test('Tests JSON5 functionality', () => {
        console.log('Testing JSON5 import...')

        try {
            const testObj = { "special-key": "value", "another.key": "another value" }
            const jsonString = JSON5.stringify(testObj, null, 2)
            console.log('JSON5.stringify working:', jsonString)

            const parsedObj = JSON5.parse(jsonString)
            console.log('JSON5.parse working:', parsedObj)

            console.log('JSON5 import test PASSED')

            // Assertions
            expect(jsonString).toContain('special-key')
            expect(parsedObj).toHaveProperty('special-key')
            expect(parsedObj['special-key']).toBe('value')
        } catch (error) {
            expect(error).toBeUndefined() // This will fail and show the error
        }
    })
})