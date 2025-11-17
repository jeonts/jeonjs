import { js2jeon } from '../js2jeon'
import { expect, test } from '@woby/chk'

test('Debug array processing with empty statements', () => {
    console.log('=== Debug Array Processing ===')

    // Test with empty statements
    const code = 'function test() { ; }'

    console.log('Original code:')
    console.log(code)

    try {
        // Convert JS to JEON
        const jeon = js2jeon(code)
        console.log('\nJEON output:')
        console.log(JSON.stringify(jeon, null, 2))

        // Assertions
        expect(jeon).toBeDefined()
    } catch (e: any) {
        console.log('Error:', e.message)
        console.log(e.stack)
        throw e
    }
})