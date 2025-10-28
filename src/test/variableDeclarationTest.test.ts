import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'

test('Variable Declaration Conversion Test', () => {
    test('Converts variable declarations to JEON', () => {
        const code = `let count = 0; let message = "Hello World";`

        console.log('=== Testing Variable Declaration Conversion ===')
        console.log('Input code:', code)

        try {
            const jeon = js2jeon(code)
            expect(jeon).toBeDefined()
            expect(typeof jeon).toBe('object')

            console.log('JEON output:')
            console.log(JSON.stringify(jeon, null, 2))
        } catch (error: any) {
            expect(error).toBeUndefined() // This will fail and show the error
        }
    })
})