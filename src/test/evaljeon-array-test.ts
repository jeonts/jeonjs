// Test evalJeon with the provided JEON array
import { evalJeon } from '../safeEval'
import { JeonExpression } from '../JeonExpression'

console.log('=== Testing evalJeon with JEON Array ===\n')

// Test the provided JEON array
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

// Test 1: Process each element separately with shared context
console.log('\nTest 1: Processing elements with shared context:')
try {
    // Create a shared context
    const context: Record<string, any> = {}

    // Process the function definition first
    const functionResult = evalJeon(jeonArray[0], context)
    console.log('Function definition result:', functionResult)
    console.log('Context after function definition:', Object.keys(context))

    // Add the function to the context manually if needed
    if (typeof functionResult === 'function') {
        context.a = functionResult
    }

    // Process the function call
    const callResult = evalJeon(jeonArray[1], context)
    console.log('Function call result:', callResult)
} catch (error: any) {
    console.log('Error:', error.message)
}

// Test 2: Let evalJeon handle the array directly
console.log('\n\nTest 2: Letting evalJeon handle the array directly:')
try {
    // When evalJeon processes an array, it evaluates each element in sequence
    // and returns the result of the last element
    const result = evalJeon(jeonArray)
    console.log('Result:', result)
    console.log('Type:', typeof result)
} catch (error: any) {
    console.log('Error:', error.message)
    console.log('This is expected because the function is not available in the context when the call is made.')
}

// Test 3: Define function in context first
console.log('\n\nTest 3: Define function in context first:')
try {
    // First, create the function
    const functionDefinition = {
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
    }

    const func = evalJeon(functionDefinition)
    console.log('Function created:', typeof func)

    // Then call it with context
    const callExpression = {
        "()": [
            "@a",
            "world"
        ]
    }

    const result = evalJeon(callExpression, { a: func })
    console.log('Result:', result)
} catch (error: any) {
    console.log('Error:', error.message)
}