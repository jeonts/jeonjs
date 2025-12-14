import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Multi-Statement Debug Test ===\n')

// Test multiple statements
const multiStatementCode = `
function greet(name) {
  return "Hello, " + name;
}
greet("World");
`

try {
    console.log('Multi-statement code:', multiStatementCode)
    const jeon = js2jeon(multiStatementCode)
    console.log('JEON:', JSON.stringify(jeon, null, 2))

    // Pass the entire JEON to evalJeon, not individual items
    const context: any = {}
    console.log('\n--- Evaluating entire JEON ---')

    const result = evalJeon(jeon, context)
    console.log('Final result:', result)
    console.log('Final context:', context)
    console.log('Final context keys:', Object.keys(context))

    console.log('✓ Evaluation completed\n')

} catch (error: any) {
    console.error('✗ Test failed:', error.message)
    console.error('Stack:', error.stack)
    console.log('')
}