import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

// Test case2 specifically
const testCase2 = {
    name: 'case2',
    code: `function a(name) { return ("Hello, " + name) }`,
    jeon: {
        "function a(name)": [
            {
                "return": {
                    "(": {
                        "+": [
                            "Hello, ",
                            "@name"
                        ]
                    }
                }
            }
        ]
    },
    eval: undefined
}

console.log('=== Debugging Case2 ===\n')

try {
    console.log('Test case eval property:', testCase2.eval)
    console.log('Type of eval property:', typeof testCase2.eval)
    console.log('Has eval property:', 'eval' in testCase2)

    // Convert JavaScript to JEON
    console.log('\n1. Converting JavaScript to JEON:')
    const jeonResult = js2jeon(testCase2.code, { iife: true })
    console.log('JEON result:')
    console.log(JSON.stringify(jeonResult, null, 2))

    // Evaluate the JEON
    console.log('\n2. Evaluating JEON:')
    const result = evalJeon(jeonResult)
    console.log('Evaluation result:')
    console.log(result)
    console.log('Type of result:', typeof result)
    console.log('Is result undefined?', result === undefined)
    console.log('Is result strictly undefined?', result === undefined)

    // Check if result matches expected
    if (result === testCase2.eval) {
        console.log('\n✅ SUCCESS: Result matches expected value!')
        console.log(`Expected: ${testCase2.eval}`)
        console.log(`Actual: ${result}`)
    } else {
        console.log('\n❌ FAILURE: Result does not match expected value!')
        console.log(`Expected: ${testCase2.eval}`)
        console.log(`Actual: ${result}`)
        console.log(`Are they strictly equal? ${result === testCase2.eval}`)
    }

} catch (error: any) {
    console.log('\n❌ Error occurred:')
    console.log(error.message)
    console.log(error.stack)
}