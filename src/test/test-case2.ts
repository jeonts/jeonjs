import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Testing Case2 ===\n')

try {
    const code = `function a(name) { return ("Hello, " + name) }`

    console.log('Original code:')
    console.log(code)

    // Convert JavaScript to JEON
    console.log('\n1. Converting JavaScript to JEON:')
    const jeonResult = js2jeon(code, { iife: true })
    console.log('JEON result:')
    console.log(JSON.stringify(jeonResult, null, 2))

    // Evaluate the JEON
    console.log('\n2. Evaluating JEON:')
    const result = evalJeon(jeonResult)
    console.log('Evaluation result:')
    console.log(result)
    console.log('Type of result:', typeof result)
    console.log('Is result undefined?', result === undefined)

    // Expected result for case2
    const expected = undefined
    console.log('\nExpected result:', expected)
    console.log('Expected type:', typeof expected)

    // Check if result matches expected
    if (result === expected) {
        console.log('\n✅ SUCCESS: Result matches expected value!')
    } else {
        console.log('\n❌ FAILURE: Result does not match expected value!')
        console.log(`Expected: ${expected} (type: ${typeof expected})`)
        console.log(`Actual: ${result} (type: ${typeof result})`)
    }

} catch (error: any) {
    console.log('\n❌ Error occurred:')
    console.log(error.message)
    console.log(error.stack)
}