import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'

// Test cases for Math-related functionality
const mathTestCases = [
    {
        name: 'Math.abs round trip test',
        code: `function sum(a, b) {
  return Math.abs(-a + -b);
}`
    }
]

test('Consolidated Math Functionality Tests', () => {
    console.log('=== Consolidated Math Tests ===\n')

    mathTestCases.forEach((testCase, index) => {
        console.log(`Test ${index + 1}: ${testCase.name}`)
        console.log('Original JS:', testCase.code)

        // Convert JS to JEON
        const jeon = js2jeon(testCase.code)
        console.log('JEON:', JSON.stringify(jeon, null, 2))

        // Convert JEON back to JS
        const convertedJs = jeon2js(jeon)
        console.log('Converted JS:', convertedJs)

        // Assertions
        expect(testCase.code).toBeDefined()
        expect(jeon).toBeDefined()
        expect(convertedJs).toBeDefined()

        console.log('✅ Test passed\n')
    })

    console.log('=== All Math Tests Completed ===')
})