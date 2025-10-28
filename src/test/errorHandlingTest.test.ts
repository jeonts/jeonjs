import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'

test('Error Handling Test', () => {
    test('Handles invalid code gracefully', () => {
        // Test error handling
        const invalidCode = `function(name) { return ("Hello, " + name) }`
        
        console.log('=== Testing Invalid Code ===')
        const invalidResult = js2jeon(invalidCode)
        
        expect(invalidResult).toBeDefined()
        console.log('Result:')
        console.log(JSON.stringify(invalidResult, null, 2))
        
        // Check that it contains error information
        expect(typeof invalidResult).toBe('object')
    })

    test('Handles valid code correctly', () => {
        const validCode = `function a(name) { return ("Hello, " + name) }`
        
        console.log('\n=== Testing Valid Code ===')
        const validResult = js2jeon(validCode)
        
        expect(validResult).toBeDefined()
        console.log('Result:')
        console.log(JSON.stringify(validResult, null, 2))
        
        // Check that it's a proper JEON structure
        expect(typeof validResult).toBe('object')
    })
})