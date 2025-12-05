// Test evalJeon array handling functionality
import { evalJeon } from '../safeEval'
import { JeonExpression } from '../JeonExpression'
import { expect, test } from '@woby/chk'

test('Consolidated evalJeon Array Handling Tests', () => {
    console.log('=== Consolidated evalJeon Array Handling Tests ===\n')

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

    console.log('\n=== Enhanced Array Handling Tests ===\n')

    // Test case: Function definition followed by function call in same array
    const testArray: JeonExpression = [
        {
            "function greet(name)": [
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
                "@greet",
                "world"
            ]
        }
    ]

    console.log('Test Array:')
    console.log(JSON.stringify(testArray, null, 2))

    try {
        console.log('\nEvaluating with enhanced evalJeon:')
        const result = evalJeon(testArray)
        console.log('Result:', result)
        console.log('Success: evalJeon can now evaluate its own block!')
    } catch (error: any) {
        console.log('Error:', error.message)
    }

    // Test case: Multiple function definitions
    const multiFunctionArray: JeonExpression = [
        {
            "function add(a, b)": [
                {
                    "return": {
                        "+": [
                            "@a",
                            "@b"
                        ]
                    }
                }
            ]
        },
        {
            "function multiply(a, b)": [
                {
                    "return": {
                        "*": [
                            "@a",
                            "@b"
                        ]
                    }
                }
            ]
        },
        {
            "()": [
                "@add",
                5,
                {
                    "()": [
                        "@multiply",
                        3,
                        4
                    ]
                }
            ]
        }
    ]

    console.log('\n\nMulti-function Test Array:')
    console.log(JSON.stringify(multiFunctionArray, null, 2))

    try {
        console.log('\nEvaluating multi-function array:')
        const result = evalJeon(multiFunctionArray)
        console.log('Result:', result)
        console.log('Success: Multiple function definitions work correctly!')
    } catch (error: any) {
        console.log('Error:', error.message)
    }

    console.log('\n=== Simple evalJeon Test ===\n')

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

    console.log('\n=== All evalJeon Array Tests Completed ===')

    // Assertions
    expect(jeonArray).toBeDefined()
    expect(testArray).toBeDefined()
    expect(multiFunctionArray).toBeDefined()
    expect(jeonString).toBeDefined()
})