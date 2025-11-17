import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import JSON5 from '@mainnet-pat/json5-bigint'

// Create a JSON-like interface for JSON5
const JSON5Wrapper = {
    stringify: JSON5.stringify,
    parse: JSON5.parse,
    [Symbol.toStringTag]: 'JSON'
}

const testCode = `
const obj = {
  "special-key": "hyphenated key"
};
`

test('Debug JEON Structure', () => {
    test('Converts JS to JEON and analyzes structure', () => {
        console.log('=== Debug JEON Structure ===')
        const jeon = js2jeon(testCode)

        expect(jeon).toBeDefined()
        console.log('Type of JEON:', typeof jeon)
        console.log('JEON structure:')
        console.log(JSON.stringify(jeon, null, 2))

        if (Array.isArray(jeon)) {
            console.log('JEON is an array with', jeon.length, 'elements')
            jeon.forEach((item, index) => {
                console.log(`Element ${index}:`, typeof item)
                console.log(JSON.stringify(item, null, 2))
            })
        } else {
            console.log('JEON is an object')
            console.log('JEON keys:', Object.keys(jeon))
        }

        // Assertions
        expect(typeof jeon).toBe('object')
        expect(jeon).not.toBeNull()
    })
})