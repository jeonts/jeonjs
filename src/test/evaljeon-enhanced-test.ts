// Test that evalJeon can now evaluate its own block
import { evalJeon } from '../safeEval'
import { JeonExpression } from '../JeonExpression'

console.log('=== Testing evalJeon Enhanced Array Handling ===\n')

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