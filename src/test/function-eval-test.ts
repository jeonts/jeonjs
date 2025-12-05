import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Function Eval Test ===\n')

// Test evaluating a function declaration object directly
const testCode = `
function greet(name) {
  return "Hello, " + name;
}
`

try {
    console.log('Code:', testCode)
    const jeon = js2jeon(testCode)
    console.log('JEON:', JSON.stringify(jeon, null, 2))
    
    // Let's manually evaluate the function declaration object
    const context: any = {}
    console.log('\n--- Evaluating function declaration directly ---')
    
    const functionDecl = jeon as any
    console.log('Function declaration:', JSON.stringify(functionDecl, null, 2))
    
    const result = evalJeon(functionDecl, context)
    console.log('Result:', result)
    console.log('Type of result:', typeof result)
    console.log('Context after evaluation:', Object.keys(context))
    
    console.log('✓ Function evaluation test completed\n')
    
} catch (error: any) {
    console.error('✗ Test failed:', error.message)
    console.error('Stack:', error.stack)
    console.log('')
}