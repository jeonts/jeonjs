import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'

test('Comprehensive Variable Declaration Grouping Test', () => {
    test('Module level declarations', () => {
        const code = `let a = 1; let b = 2; const C = 3;`
        try {
            const jeon = js2jeon(code)
            expect(jeon).toBeDefined()
            expect(typeof jeon).toBe('object')
            
            console.log('Module level - Input:', code)
            console.log('Module level - Output:', JSON.stringify(jeon, null, 2))
        } catch (error: any) {
            expect(error).toBeUndefined() // This will fail and show the error
        }
    })

    test('Function level declarations', () => {
        const code = `function test() { let a = 1; let b = 2; const C = 3; return a + b; }`
        try {
            const jeon = js2jeon(code)
            expect(jeon).toBeDefined()
            expect(typeof jeon).toBe('object')
            
            console.log('Function level - Input:', code)
            console.log('Function level - Output:', JSON.stringify(jeon, null, 2))
        } catch (error: any) {
            expect(error).toBeUndefined() // This will fail and show the error
        }
    })

    test('Arrow function level declarations', () => {
        const code = `const arrow = () => { let a = 1; let b = 2; const C = 3; return a + b; };`
        try {
            const jeon = js2jeon(code)
            expect(jeon).toBeDefined()
            expect(typeof jeon).toBe('object')
            
            console.log('Arrow function level - Input:', code)
            console.log('Arrow function level - Output:', JSON.stringify(jeon, null, 2))
        } catch (error: any) {
            expect(error).toBeUndefined() // This will fail and show the error
        }
    })

    test('Class method level declarations', () => {
        const code = `class Test { method() { let a = 1; let b = 2; const C = 3; return a + b; } }`
        try {
            const jeon = js2jeon(code)
            expect(jeon).toBeDefined()
            expect(typeof jeon).toBe('object')
            
            console.log('Class method level - Input:', code)
            console.log('Class method level - Output:', JSON.stringify(jeon, null, 2))
        } catch (error: any) {
            expect(error).toBeUndefined() // This will fail and show the error
        }
    })

    test('Mixed with other statements', () => {
        const code = `let a = 1; console.log(a); let b = 2; const C = 3;`
        try {
            const jeon = js2jeon(code)
            expect(jeon).toBeDefined()
            expect(typeof jeon).toBe('object')
            
            console.log('Mixed with other statements - Input:', code)
            console.log('Mixed with other statements - Output:', JSON.stringify(jeon, null, 2))
        } catch (error: any) {
            expect(error).toBeUndefined() // This will fail and show the error
        }
    })
})