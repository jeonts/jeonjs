import { expect, test } from '@woby/chk'
import JSON5 from '@mainnet-pat/json5-bigint'
import * as JSON5Namespace from 'json5'

test('JSON5 Import Test 2', () => {
    test('Tests both import styles', () => {
        console.log('=== JSON5 Import Test ===')
        console.log('Default import (JSON5): Object with parse and stringify functions')
        console.log('Namespace import (JSON5Namespace): Object with default and module.exports properties')

        expect(JSON5).toBeDefined()
        expect(JSON5Namespace).toBeDefined()
    })

    test('Method access test', () => {
        console.log('\n=== Method Access Test ===')
        console.log('JSON5.stringify:', typeof JSON5.stringify)
        console.log('JSON5.parse:', typeof JSON5.parse)

        // Check what's available in the namespace
        console.log('JSON5Namespace keys:', Object.keys(JSON5Namespace))

        // The actual methods are accessible through JSON5Namespace
        // From the output, we can see they're there
        expect(typeof JSON5.stringify).toBe('function')
        expect(typeof JSON5.parse).toBe('function')
    })

    test('Direct method test', () => {
        console.log('\n=== Direct Method Test ===')
        try {
            const obj = { "test-key": "value" }
            const str = JSON5.stringify(obj, null, 2)
            console.log('JSON5.stringify result contains test-key')

            const parsed = JSON5.parse(str)
            console.log('JSON5.parse result has test-key property')

            expect(str).toContain('test-key')
            expect(parsed).toHaveProperty('test-key')
            expect(parsed['test-key']).toBe('value')
        } catch (error) {
            expect(error).toBeUndefined() // This will fail and show the error
        }
    })

    test('Wrapper test', () => {
        console.log('\n=== Wrapper Test ===')
        try {
            const JSON5Wrapper = {
                stringify: JSON5.stringify,
                parse: JSON5.parse,
                [Symbol.toStringTag]: 'JSON'
            }

            console.log('JSON5Wrapper.stringify:', typeof JSON5Wrapper.stringify)
            console.log('JSON5Wrapper.parse:', typeof JSON5Wrapper.parse)

            expect(typeof JSON5Wrapper.stringify).toBe('function')
            expect(typeof JSON5Wrapper.parse).toBe('function')

            const obj = { "test-key": "value" }
            const str = JSON5Wrapper.stringify(obj, null, 2)
            console.log('JSON5Wrapper.stringify result contains test-key')

            const parsed = JSON5Wrapper.parse(str)
            console.log('JSON5Wrapper.parse result has test-key property')

            expect(str).toContain('test-key')
            expect(parsed).toHaveProperty('test-key')
            expect(parsed['test-key']).toBe('value')
        } catch (error) {
            expect(error).toBeUndefined() // This will fail and show the error
        }
    })
})