// Test evalJeon with the provided JEON array string
import { evalJeon } from '../safeEval'

console.log('=== Testing evalJeon with JEON Array String ===\n')

// Parse and test the provided JEON array string
const jeonString = '[{"function a(name)":[{"return":{"+":["Hello, ","@name"]}}]},{"()":["@a","world"]}]'

console.log('JEON String:')
console.log(jeonString)

try {
    // Parse the JSON string
    const jeonArray = JSON.parse(jeonString)
    console.log('\nParsed JEON Array:')
    console.log(JSON.stringify(jeonArray, null, 2))

    // Test direct evaluation
    console.log('\nDirect evaluation with evalJeon:')
    const result = evalJeon(jeonArray)
    console.log('Result:', result)
    console.log('Type:', typeof result)
} catch (error: any) {
    console.log('Error:', error.message)
}

// Test with proper context management
console.log('\n\nEvaluation with proper context management:')
try {
    const jeonArray = JSON.parse(jeonString)

    // Create a context to hold our variables
    const context: Record<string, any> = {}

    // Process each element in sequence, maintaining context
    let finalResult: any
    for (let i = 0; i < jeonArray.length; i++) {
        const element = jeonArray[i]

        // Evaluate the element with the current context
        const result = evalJeon(element, context)

        // If the result is a function from a function declaration, add it to context
        if (typeof result === 'function' && element && typeof element === 'object' && !Array.isArray(element)) {
            const keys = Object.keys(element)
            const functionKey = keys.find(key => key.startsWith('function'))
            if (functionKey) {
                // Extract function name from the key
                const nameMatch = functionKey.match(/function\s+(\w+)/)
                if (nameMatch) {
                    const functionName = nameMatch[1]
                    context[functionName] = result
                }
            }
        }

        // Store the result of the last element as the final result
        if (i === jeonArray.length - 1) {
            finalResult = result
        }
    }

    console.log('Final result:', finalResult)
} catch (error: any) {
    console.log('Error:', error.message)
}