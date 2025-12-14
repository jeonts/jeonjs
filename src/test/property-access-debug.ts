import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Property Access Debug ===\n')

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
    console.log('Setup JEON:', JSON.stringify(jeon, null, 2))

    // Create the context by processing the setup code
    const context: any = {}
    const items = jeon as any[]

    console.log('\n--- Setting up context ---')
    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        console.log(`\nProcessing setup item ${i}`)

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
                    console.log(`Added function ${functionName} to context`)
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
                    console.log(`Added class ${className} to context`)
                }
                continue
            }
        }

        // Normal processing
        evalJeon(item, context)
        console.log(`Processed normal item ${i}`)
    }

    console.log('\nFinal context keys:', Object.keys(context))
    console.log('greeter in context:', context.greeter)
    console.log('Type of greeter:', typeof context.greeter)
    if (context.greeter) {
        console.log('greeter properties:', Object.getOwnPropertyNames(context.greeter))
        console.log('greeter.greet:', context.greeter.greet)
        console.log('Type of greeter.greet:', typeof context.greeter.greet)
    }

    // Now test property access
    console.log('\n--- Testing Property Access ---')
    const propertyAccessExpr = {
        ".": [
            "@greeter",
            "greet"
        ]
    }

    console.log('Property access expression:', JSON.stringify(propertyAccessExpr, null, 2))
    const propResult = evalJeon(propertyAccessExpr, context)
    console.log('Property access result:', propResult)
    console.log('Type of result:', typeof propResult)

    // Now test method call
    console.log('\n--- Testing Method Call ---')
    const methodCallExpr = {
        "()": [
            {
                ".": [
                    "@greeter",
                    "greet"
                ]
            },
            "World"
        ]
    }

    console.log('Method call expression:', JSON.stringify(methodCallExpr, null, 2))
    const methodResult = evalJeon(methodCallExpr, context)
    console.log('Method call result:', methodResult)

    console.log('✓ Test completed\n')

} catch (error: any) {
    console.error('✗ Test failed:', error.message)
    console.error('Stack:', error.stack)
    console.log('')
}