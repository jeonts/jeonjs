import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Context Debug Test ===\n')

// Test the exact sequence that's failing
const testCode = `
function greet(name) {
  return "Hello, " + name;
}

class Greeter {
  constructor(prefix) {
    this.prefix = prefix;
  }
  
  greet(name) {
    return this.prefix + " " + name;
  }
}

const greeter = new Greeter(greet("Dear"));
greeter.greet("World");
`

try {
    console.log('Code:', testCode)
    const jeon = js2jeon(testCode)
    console.log('JEON:', JSON.stringify(jeon, null, 2))
    
    // Let's manually step through the evaluation
    const context: any = {}
    console.log('\n--- Manual Evaluation ---')
    
    // Process each item in the array
    const items = jeon as any[]
    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        console.log(`\nProcessing item ${i + 1}:`, JSON.stringify(item, null, 2))
        
        const result = evalJeon(item, context)
        console.log(`Result of item ${i + 1}:`, result)
        console.log(`Context after item ${i + 1}:`, Object.keys(context))
        
        if (i === items.length - 1) {
            console.log('Final result:', result)
        }
    }
    
    console.log('✓ Manual evaluation completed\n')
    
} catch (error: any) {
    console.error('✗ Test failed:', error.message)
    console.error('Stack:', error.stack)
    console.log('')
}