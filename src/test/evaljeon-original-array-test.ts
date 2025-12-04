// Test evalJeon with the original JEON array - correct approach
import { evalJeon } from '../safeEval'

console.log('=== Testing Original JEON Array Correctly ===\n')

// The original JEON array
const jeonArray = [
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

console.log('Original JEON Array:')
console.log(JSON.stringify(jeonArray, null, 2))

// Correct approach: Manually process the array elements with context management
console.log('\nProcessing with proper context management:')
try {
    // Create a context to hold our variables
    const context: any = {}

    // Process each element in sequence, maintaining context
    let finalResult: any
    for (let i = 0; i < jeonArray.length; i++) {
        const element = jeonArray[i]
        console.log(`\nProcessing element ${i + 1}:`, JSON.stringify(element))

        finalResult = evalJeon(element, context)
        console.log(`Result:`, finalResult)

        // If this is a function definition, store it in context
        if (element && typeof element === 'object' && !Array.isArray(element)) {
            const keys = Object.keys(element)
            for (const key of keys) {
                if (key.startsWith('function')) {
                    // Extract function name from key like "function a(name)"
                    const nameMatch = key.match(/function\s+(\w+)/)
                    if (nameMatch) {
                        const funcName = nameMatch[1]
                        console.log(`Storing function '${funcName}' in context`)
                        context[funcName] = finalResult
                    }
                }
            }
        }
    }

    console.log('\nFinal result:', finalResult)
} catch (error: any) {
    console.log('Error:', error.message)
}

// Alternative: Show what happens when we process the array as a whole
console.log('\n\nWhat happens when we process the array as a whole:')
try {
    const result = evalJeon(jeonArray)
    console.log('Result:', result)
} catch (error: any) {
    console.log('Error:', error.message)
}