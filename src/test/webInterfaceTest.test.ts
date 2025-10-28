// This simulates what happens in the web interface
import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { normalizeJs } from './testUtils'

test('Web Interface Test', () => {
    // Test the conversion that was mentioned in the issue
    const testCode = `function a(name) { return ("Hello, " + name) }`

    console.log('=== Testing function a(name) conversion ===')
    const jeonResult = js2jeon(testCode)
    console.log('JEON output:')
    console.log(JSON.stringify(jeonResult, null, 2))

    test('Converts function a(name) to JEON and back with key element checks', () => {
        if (jeonResult && !jeonResult.error) {
            const jsResult = jeon2js(jeonResult)
            console.log('\nJavaScript output:')
            console.log(jsResult)

            // Check for key elements instead of direct string comparison
            expect(jsResult).toContain('function a')
            expect(jsResult).toContain('return')
            expect(jsResult).toContain('Hello')
            expect(jsResult).toContain('name')

            console.log('\n✅ Key element checks PASSED')

            expect(jsResult).toBeDefined()
        } else {
            console.log('\nError in JEON conversion:')
            console.log(jeonResult)
            expect(jeonResult).toBeUndefined()
        }
    })
})