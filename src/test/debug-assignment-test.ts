import { evalJeon } from '../safeEval'

console.log('=== Debug Assignment Test ===\n')

try {
    // Create a simple object to test property assignment
    const obj: any = {}

    // Create a context with the object and a value
    const context = {
        this: obj,
        name: 'Alice'
    }

    // Test the assignment expression directly
    const assignmentExpr = {
        "=": [
            {
                ".": [
                    "@this",
                    "name"
                ]
            },
            "@name"
        ]
    }

    console.log('Context before assignment:', context)
    console.log('Obj before assignment:', obj)

    console.log('\nEvaluating assignment expression...')
    const result = evalJeon(assignmentExpr, context)
    console.log('Assignment result:', result)

    console.log('Context after assignment:', context)
    console.log('Obj after assignment:', obj)
    console.log('obj.name:', obj.name)

    console.log('\n=== Test completed ===')

} catch (error: any) {
    console.error('❌ Error:', error.message)
    console.error('Stack:', error.stack)
}