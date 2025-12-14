import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Detailed Debug Test ===\n')

// Test just the function declaration
const functionCode = `
function greet(name) {
  return "Hello, " + name;
}
`

try {
    console.log('Function code:', functionCode)
    const jeon = js2jeon(functionCode)
    console.log('JEON:', JSON.stringify(jeon, null, 2))

    // Let's manually step through the evaluation
    const context: any = {}
    console.log('\n--- Manual Evaluation ---')

    // Process each item in the array
    const items = Array.isArray(jeon) ? jeon : [jeon]
    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        console.log(`\nProcessing item ${i + 1}:`, JSON.stringify(item, null, 2))

        const result = evalJeon(item, context)
        console.log(`Result of item ${i + 1}:`, result)
        console.log(`Context after item ${i + 1}:`, context)
        console.log(`Context keys:`, Object.keys(context))
    }

    console.log('✓ Manual evaluation completed\n')

} catch (error: any) {
    console.error('✗ Test failed:', error.message)
    console.error('Stack:', error.stack)
    console.log('')
}