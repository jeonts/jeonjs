import { evalJeon } from '../safeEval'

console.log('=== New Operator Debug Test ===\n')

try {
    // Create a context with our Person class
    const context: any = {}

    // Create a simple class constructor for testing
    context.Person = function (this: any, name: string) {
        this.name = name
    }

    context.Person.prototype.greet = function () {
        return "Hello, " + this.name
    }

    console.log('Context has Person:', typeof context.Person)

    // Test the new operator directly
    const newOperatorExpr = {
        "new": [
            "Person",
            "Alice"
        ]
    }

    console.log('\nTesting new operator expression:')
    console.log(JSON.stringify(newOperatorExpr, null, 2))

    const result = evalJeon(newOperatorExpr, context)
    console.log('Result:', result)
    console.log('Result name:', result.name)
    console.log('Result greet():', result.greet())

} catch (error: any) {
    console.error('Error:', error.message)
    console.error(error.stack)
}