import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'

test('Simple Parse Test', () => {
    // Test different function types
    const namedFunctionCode = `function a(name) { return ("Hello, " + name) }`
    const arrowFunctionCode = `(x) => { return (x * 2); }`
    const anonymousFunctionCode = `(function(name) { return ("Hello, " + name) })`

    test('Named function parsing', () => {
        console.log('=== Testing Named Function ===')
        try {
            const namedJeon = js2jeon(namedFunctionCode)
            console.log('Named function JEON:')
            console.log(JSON.stringify(namedJeon, null, 2))
            
            expect(namedJeon).toBeDefined()
        } catch (error: any) {
            console.log('Error parsing named function:', error.message)
            expect(error).toBeUndefined()
        }
    })

    test('Arrow function parsing', () => {
        console.log('\n=== Testing Arrow Function ===')
        try {
            const arrowJeon = js2jeon(arrowFunctionCode)
            console.log('Arrow function JEON:')
            console.log(JSON.stringify(arrowJeon, null, 2))
            
            expect(arrowJeon).toBeDefined()
        } catch (error: any) {
            console.log('Error parsing arrow function:', error.message)
            expect(error).toBeUndefined()
        }
    })

    test('Anonymous function expression parsing', () => {
        console.log('\n=== Testing Anonymous Function Expression ===')
        try {
            const anonymousJeon = js2jeon(anonymousFunctionCode)
            console.log('Anonymous function JEON:')
            console.log(JSON.stringify(anonymousJeon, null, 2))
            
            expect(anonymousJeon).toBeDefined()
        } catch (error: any) {
            console.log('Error parsing anonymous function:', error.message)
            expect(error).toBeUndefined()
        }
    })
})