import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Detailed Debug Test ===\n')

// Test just the function declaration
const testCode = `
function greet(name) {
  return "Hello, " + name;
}
`

try {
    console.log('Code:', testCode)
    const jeon = js2jeon(testCode)
    console.log('JEON:', JSON.stringify(jeon, null, 2))

    // Let's manually step through the evaluation
    const context: any = {}
    console.log('\n--- Manual Evaluation ---')

    // Process the function declaration item
    const item = jeon as any
    console.log('Item:', JSON.stringify(item, null, 2))

    if (item && typeof item === 'object' && !Array.isArray(item)) {
        const keys = Object.keys(item)
        console.log('Keys:', keys)

        const functionDeclarationKey = keys.find(key => key.startsWith('function') || key.startsWith('function*'))
        console.log('Function declaration key:', functionDeclarationKey)

        if (functionDeclarationKey) {
            console.log('Found function declaration key')
            // Extract function name from the key
            const nameMatch = functionDeclarationKey.match(/function\*?\s+(\w+)/)
            console.log('Name match result:', nameMatch)

            if (nameMatch) {
                console.log('Name match succeeded')
                const functionName = nameMatch[1]
                console.log('Function name:', functionName)

                // Create the function without evaluating its body immediately
                const functionResult = evalJeon(item, context)
                console.log('Function result:', typeof functionResult)

                context[functionName] = functionResult
                console.log('Added to context')

                console.log('Context after adding function:', Object.keys(context))
            } else {
                console.log('Name match failed')
            }
        } else {
            console.log('No function declaration key found')
        }
    }

    console.log('✓ Manual evaluation completed\n')

} catch (error: any) {
    console.error('✗ Test failed:', error.message)
    console.error('Stack:', error.stack)
    console.log('')
}