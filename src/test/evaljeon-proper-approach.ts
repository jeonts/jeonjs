// Demonstrate proper way to use evalJeon with the given array
import { evalJeon } from '../safeEval'
import { JeonExpression } from '../JeonExpression'

console.log('=== Proper Way to Use evalJeon with Given Array ===\n')

// The original JEON array
const jeonArray: JeonExpression = [
    {
        "function a(name)": [
            {
                "return": {
                    "+": [
                        "Hello, ",
                        "@name"
                    ]
                }
            }
        ]
    },
    {
        "()": [
            "@a",
            "world"
        ]
    }
]

console.log('JEON Array:')
console.log(JSON.stringify(jeonArray, null, 2))

// Proper approach: Create a context and process elements sequentially
console.log('\nProper approach - sequential processing with context:')
try {
    // Create a context to hold our variables
    const context: Record<string, any> = {}

    // Process each element in sequence, maintaining context
    let finalResult: any
    for (let i = 0; i < jeonArray.length; i++) {
        const element = jeonArray[i]
        console.log(`\nProcessing element ${i + 1}:`)
        console.log(JSON.stringify(element, null, 2))

        // Evaluate the element with the current context
        const result = evalJeon(element, context)
        console.log(`Result:`, result)

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
                    console.log(`Added function '${functionName}' to context`)
                }
            }
        }

        // Store the result of the last element as the final result
        if (i === jeonArray.length - 1) {
            finalResult = result
        }
    }

    console.log('\nFinal result:', finalResult)
} catch (error: any) {
    console.log('Error:', error.message)
}