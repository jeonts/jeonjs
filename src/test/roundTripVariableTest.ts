import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'

test('Round-trip Test for Variable Declaration Patterns', () => {
    console.log('=== Round-trip Test for Variable Declaration Patterns ===')

    test('Separate declarations round-trip conversion', () => {
        // Test 1: Separate declarations
        console.log('\n1. Separate declarations:')
        const code1 = `let a = 1; let b = 2; const C = 3; const d = 5;`
        try {
            console.log('Original:', code1)
            const jeon1 = js2jeon(code1)
            console.log('JEON:')
            console.log(JSON.stringify(jeon1, null, 2))

            const regenerated1 = jeon2js(jeon1)
            console.log('Regenerated:')
            console.log(regenerated1)

            expect(jeon1).toBeDefined()
            expect(regenerated1).toBeDefined()
        } catch (error) {
            console.error('Error:', error)
            expect(error).toBeUndefined()
        }
    })

    test('Combined declarations round-trip conversion', () => {
        // Test 2: Combined declarations
        console.log('\n2. Combined declarations:')
        const code2 = `let a = 1, b = 2; const C = 3, d = 5;`
        try {
            console.log('Original:', code2)
            const jeon2 = js2jeon(code2)
            console.log('JEON:')
            console.log(JSON.stringify(jeon2, null, 2))

            const regenerated2 = jeon2js(jeon2)
            console.log('Regenerated:')
            console.log(regenerated2)

            expect(jeon2).toBeDefined()
            expect(regenerated2).toBeDefined()
        } catch (error) {
            console.error('Error:', error)
            expect(error).toBeUndefined()
        }
    })
})