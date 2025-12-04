// Test evalJeon with proper context handling
import { evalJeon } from '../safeEval'

console.log('=== Testing evalJeon with Proper Context Handling ===\n')

// Test 1: Define function in context first, then call it
console.log('Test 1: Define function in context first')
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

    console.log('Creating function:')
    const func = evalJeon(functionDefinition)
    console.log('Function created:', typeof func)

    // Then call it with context
    const callExpression = {
        "()": [
            "@a",
            "world"
        ]
    }

    console.log('\nCalling function with context:')
    const result = evalJeon(callExpression, { a: func })
    console.log('Result:', result)
} catch (error: any) {
    console.log('Error:', error.message)
}

// Test 2: Alternative approach - define and call in sequence with context propagation
console.log('\n\nTest 2: Manual context management')
try {
    // Create an empty context
    const context: any = {}

    // Process the function definition and store it in context
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

    console.log('Creating function and storing in context:')
    context.a = evalJeon(functionDefinition)
    console.log('Function stored in context')

    // Process the function call using the context
    const callExpression = {
        "()": [
            "@a",
            "world"
        ]
    }

    console.log('\nCalling function using context:')
    const result = evalJeon(callExpression, context)
    console.log('Result:', result)
} catch (error: any) {
    console.log('Error:', error.message)
}

console.log('\n\n=== Summary ===')
console.log('The issue is that evalJeon does not automatically register function definitions')
console.log('from array elements into the execution context for subsequent elements.')
console.log('Functions must be explicitly managed in the context.')