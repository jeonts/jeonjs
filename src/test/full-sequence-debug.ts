import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Full Sequence Debug ===\n')

// Test the exact full sequence
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
`

try {
    console.log('Code:', testCode)
    const jeon = js2jeon(testCode)
    console.log('JEON:', JSON.stringify(jeon, null, 2))

    // Simulate array processing
    const context: any = {}
    const items = jeon as any[]

    console.log('\n--- Processing Items ---')
    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        console.log(`\nItem ${i}:`, JSON.stringify(item, null, 2))

        // Check if this is a function declaration
        if (item && typeof item === 'object' && !Array.isArray(item)) {
            const keys = Object.keys(item)
            console.log('Keys:', keys)

            const functionDeclarationKey = keys.find(key => key.startsWith('function') || key.startsWith('function*'))
            console.log('Function declaration key found:', functionDeclarationKey)

            if (functionDeclarationKey) {
                console.log('Processing as function declaration')
                // Extract function name from the key
                const nameMatch = functionDeclarationKey.match(/function\*?\s+(\w+)/)
                console.log('Name match:', nameMatch)

                if (nameMatch) {
                    const functionName = nameMatch[1]
                    console.log('Function name:', functionName)

                    // Create the function
                    const functionResult = evalJeon(item, context)
                    console.log('Function result type:', typeof functionResult)

                    // Add to context
                    context[functionName] = functionResult
                    console.log('Added to context')
                }
                console.log('Context after item', i, ':', Object.keys(context))
                continue // Skip normal processing
            }

            // Check if this is a class declaration
            const classDeclarationKey = keys.find(key => key.startsWith('class '))
            console.log('Class declaration key found:', classDeclarationKey)

            if (classDeclarationKey) {
                console.log('Processing as class declaration')
                // Extract class name from the key
                const classNameMatch = classDeclarationKey.match(/class\s+(\w+)/)
                console.log('Class name match:', classNameMatch)

                if (classNameMatch) {
                    const className = classNameMatch[1]
                    console.log('Class name:', className)

                    // Create the class
                    const classResult = evalJeon(item, context)
                    console.log('Class result type:', typeof classResult)

                    // Add to context
                    context[className] = classResult
                    console.log('Added class to context')
                }
                console.log('Context after item', i, ':', Object.keys(context))
                continue // Skip normal processing
            }
        }

        // Normal processing
        console.log('Processing as normal item')
        const result = evalJeon(item, context)
        console.log('Result:', result)
        console.log('Context after item', i, ':', Object.keys(context))
    }

    console.log('\nFinal context:', Object.keys(context))

    // Now test calling the function
    console.log('\n--- Testing Function Call ---')
    if (context.greet) {
        const result = context.greet("World")
        console.log('Function call result:', result)
    } else {
        console.log('Function not found in context')
    }

    // Test creating the greeter
    console.log('\n--- Testing Greeter Creation ---')
    if (context.Greeter) {
        const greeter = new context.Greeter("Hello")
        console.log('Greeter created:', greeter)
        console.log('Greeter prefix:', greeter.prefix)
    } else {
        console.log('Greeter class not found in context')
    }

    console.log('✓ Test completed\n')

} catch (error: any) {
    console.error('✗ Test failed:', error.message)
    console.error('Stack:', error.stack)
    console.log('')
}