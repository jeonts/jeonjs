import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Property Access Test ===\n')

// Test property access step by step
const testCode = `
class Greeter {
  constructor(prefix) {
    this.prefix = prefix;
  }
  
  greet(name) {
    return this.prefix + " " + name;
  }
}

const greeter = new Greeter("Hello");
greeter
`

try {
    console.log('Code:', testCode)
    const jeon = js2jeon(testCode)
    console.log('JEON:', JSON.stringify(jeon, null, 2))
    const result = evalJeon(jeon)
    console.log('Result:', result)
    console.log('Type of result:', typeof result)
    console.log('Has greet method:', typeof result.greet)
    console.log('✓ Object creation test passed\n')
    
    // Now test property access separately
    const propAccessCode = `
const obj = greeter;
obj.greet
`
    console.log('Property access code:', propAccessCode)
    const propJeon = js2jeon(propAccessCode)
    console.log('Property access JEON:', JSON.stringify(propJeon, null, 2))
    const propResult = evalJeon(propJeon, { greeter: result })
    console.log('Property access result:', propResult)
    console.log('Type of property access result:', typeof propResult)
    console.log('✓ Property access test passed\n')
    
    // Now test method call
    const methodCallCode = `
const obj = greeter;
obj.greet("World")
`
    console.log('Method call code:', methodCallCode)
    const methodJeon = js2jeon(methodCallCode)
    console.log('Method call JEON:', JSON.stringify(methodJeon, null, 2))
    const methodResult = evalJeon(methodJeon, { greeter: result })
    console.log('Method call result:', methodResult)
    console.log('✓ Method call test passed\n')
    
} catch (error: any) {
    console.error('✗ Test failed:', error.message)
    console.error('Stack:', error.stack)
    console.log('')
}