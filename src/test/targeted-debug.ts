import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Targeted Debug ===\n')

// First create the context with our objects
const setupCode = `
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
`

try {
    console.log('Setup code:', setupCode)
    const jeon = js2jeon(setupCode)

    // Create the context by processing the setup code
    const context: any = {}
    const items = jeon as any[]

    console.log('\n--- Setting up context ---')
    for (let i = 0; i < items.length; i++) {
        const item = items[i]

        // Check if this is a function declaration
        if (item && typeof item === 'object' && !Array.isArray(item)) {
            const keys = Object.keys(item)
            const functionDeclarationKey = keys.find(key => key.startsWith('function') || key.startsWith('function*'))
            const classDeclarationKey = keys.find(key => key.startsWith('class '))

            if (functionDeclarationKey) {
                // Extract function name from the key
                const nameMatch = functionDeclarationKey.match(/function\*?\s+(\w+)/)
                if (nameMatch) {
                    const functionName = nameMatch[1]
                    // Create the function
                    const functionResult = evalJeon(item, context)
                    // Add to context
                    context[functionName] = functionResult
                }
                continue
            }

            if (classDeclarationKey) {
                // Extract class name from the key
                const classNameMatch = classDeclarationKey.match(/class\s+(\w+)/)
                if (classNameMatch) {
                    const className = classNameMatch[1]
                    // Create the class
                    const classResult = evalJeon(item, context)
                    // Add to context
                    context[className] = classResult
                }
                continue
            }
        }

        // Normal processing
        evalJeon(item, context)
    }

    console.log('\nContext setup complete')
    console.log('greeter in context:', context.greeter)
    console.log('Type of greeter:', typeof context.greeter)
    if (context.greeter) {
        console.log('greeter.greet:', context.greeter.greet)
        console.log('Type of greeter.greet:', typeof context.greeter.greet)
        console.log('"greet" in greeter:', "greet" in context.greeter)
    }

    // Now manually test the property access logic step by step
    console.log('\n--- Manual Property Access Test ---')

    // Step 1: Evaluate the object reference "@greeter"
    const objRef = "@greeter"
    const obj = evalJeon(objRef, context)
    console.log('Object reference "@greeter" evaluates to:', obj)
    console.log('Type of object:', typeof obj)

    // Step 2: Evaluate the property name "greet"
    const propName = "greet"
    const prop = evalJeon(propName, context)
    console.log('Property name "greet" evaluates to:', prop)
    console.log('Type of property name:', typeof prop)

    // Step 3: Check if property exists
    console.log(`"${prop}" in obj:`, prop in obj)

    // Step 4: Access the property
    if (obj && typeof obj === 'object' && prop in obj) {
        const result = obj[prop]
        console.log('Property access result:', result)
        console.log('Type of result:', typeof result)
    } else {
        console.log('Property access failed')
    }

    console.log('✓ Test completed\n')

} catch (error: any) {
    console.error('✗ Test failed:', error.message)
    console.error('Stack:', error.stack)
    console.log('')
}