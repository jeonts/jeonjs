// Final demo tests showing the exact use cases from the requests
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { evalJeon } from '../safeEval'
import { expect, test } from '@woby/chk'
import { convertToIIFE } from '../iifeConverter'

test('Consolidated Final Demo Tests', () => {
    console.log('=== Consolidated Final Demo Tests ===\n')

    // Test 1: Final demo - JS to JEON to JS to Eval
    console.log('Test 1: Final Demo - JS to JEON to JS to Eval')
    // The exact example from the request
    const originalCode1 = `(function a(name) { 
      return 'Hello, ' + name; 
    }, a('world'))`

    console.log('Original JavaScript:')
    console.log(originalCode1)
    console.log('')

    try {
        // Step 1: Convert JavaScript to JEON
        const jeon = js2jeon(originalCode1)
        console.log('Step 1: JavaScript → JEON')
        console.log(JSON.stringify(jeon, null, 2))
        console.log('')

        // Step 2: Convert JEON back to JavaScript
        const regeneratedJs = jeon2js(jeon)
        console.log('Step 2: JEON → JavaScript')
        console.log(regeneratedJs)
        console.log('')

        // Step 3: Evaluate the JEON
        console.log('Step 3: Evaluate JEON')
        const result = evalJeon(jeon)
        console.log('Result:', result)
        console.log('')

        // Verification
        console.log('=== Verification ===')
        console.log('Expected: "Hello, world"')
        console.log('Actual:', JSON.stringify(result))
        console.log(result === 'Hello, world' ? '✅ SUCCESS: Implementation works correctly!' : '❌ FAILURE: Results do not match')

        // Assertions
        expect(jeon).toBeDefined()
        expect(regeneratedJs).toBeDefined()
        expect(result).toBeDefined()
        console.log('✅ Test 1 passed\n')
    } catch (error: any) {
        console.log('❌ ERROR:', error.message)
        console.log(error.stack)
        throw error
    }

    // Test 2: Evaluation test - Round-trip conversion verification
    console.log('Test 2: Evaluation Test - Round-trip Conversion Verification')
    // Test the original case
    const originalCode2 = '((x) => { return (x * 2); })(4)'
    console.log('Original code:', originalCode2)

    // Evaluate original directly
    const originalResult = eval(originalCode2)
    console.log('Original result:', originalResult)

    // Convert through JEON pipeline
    try {
        const jeon = js2jeon(originalCode2)
        console.log('\nJEON representation:')
        console.log(JSON.stringify(jeon, null, 2))

        const regeneratedJs = jeon2js(jeon)
        console.log('\nRegenerated JavaScript:')
        console.log(regeneratedJs)

        const iifeCode = convertToIIFE(regeneratedJs)
        console.log('\nIIFE wrapped code:')
        console.log(iifeCode)

        // Evaluate the regenerated code
        const regeneratedResult = eval(iifeCode)
        console.log('\nRegenerated result:', regeneratedResult)

        // Compare results
        if (originalResult === regeneratedResult) {
            console.log('\n✅ Results match! Round-trip conversion is successful.')
        } else {
            console.log('\n❌ Results do not match!')
            console.log('Original:', originalResult)
            console.log('Regenerated:', regeneratedResult)
        }

        // Assertions
        expect(jeon).toBeDefined()
        expect(regeneratedJs).toBeDefined()
        expect(iifeCode).toBeDefined()
        expect(regeneratedResult).toBeDefined()
        console.log('✅ Test 2 passed\n')
    } catch (error: any) {
        console.log('\n❌ Error in conversion pipeline:', error.message)
        throw error
    }

    // Test 3: Final format verification
    console.log('Test 3: Final Format Verification')
    // Test the exact case you mentioned
    const code3 = `// First comment

const a = 1;`

    const jeon3 = js2jeon(code3)
    console.log('JEON output:')
    console.log(JSON.stringify(jeon3, null, 2))

    // Verify the structure
    let formatCorrect = false
    if (Array.isArray(jeon3) && jeon3.length > 0) {
        const firstStatement = jeon3[0]
        if (firstStatement['//'] && firstStatement['//'][0] === ' First comment' &&
            firstStatement['@@'] && firstStatement['@@'].a === 1) {
            console.log('✅ Format is correct!')
            formatCorrect = true
        } else {
            console.log('❌ Format is incorrect')
            console.log('Expected: { "//": [" First comment" ], "@@": { "a": 1 } }')
            console.log('Got:', JSON.stringify(firstStatement, null, 2))
        }
    } else if (jeon3['//'] && jeon3['//'][0] === ' First comment' &&
        jeon3['@@'] && jeon3['@@'].a === 1) {
        console.log('✅ Format is correct!')
        formatCorrect = true
    } else {
        console.log('❌ Format is incorrect')
        console.log('Expected: { "//": [" First comment" ], "@@": { "a": 1 } }')
        console.log('Got:', JSON.stringify(jeon3, null, 2))
    }

    // Assertions
    expect(jeon3).toBeDefined()
    expect(formatCorrect).toBe(true)
    console.log('✅ Test 3 passed\n')

    console.log('=== All Final Demo Tests Completed ===')
})