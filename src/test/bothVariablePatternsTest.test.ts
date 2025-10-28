import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'

test('Both Variable Declaration Patterns Test', () => {
    test('Separate variable declarations', () => {
        const code = `let a = 1; let b = 2; const C = 3; const d = 5;`
        try {
            const jeon = js2jeon(code)
            expect(jeon).toBeDefined()
            expect(typeof jeon).toBe('object')
            
            console.log('Separate declarations - Input:', code)
            console.log('Separate declarations - Output:', JSON.stringify(jeon, null, 2))
        } catch (error: any) {
            expect(error).toBeUndefined() // This will fail and show the error
        }
    })

    test('Combined variable declarations', () => {
        const code = `let a = 1, b = 2; const C = 3, d = 5;`
        try {
            const jeon = js2jeon(code)
            expect(jeon).toBeDefined()
            expect(typeof jeon).toBe('object')
            
            console.log('Combined declarations - Input:', code)
            console.log('Combined declarations - Output:', JSON.stringify(jeon, null, 2))
        } catch (error: any) {
            expect(error).toBeUndefined() // This will fail and show the error
        }
    })
})