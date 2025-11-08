import { evalJeon } from '../safeEval'

console.log('=== Testing evalJeon with __undefined__ ===')

// Test JEON with uninitialized variables
const jeon = {
    "@": {
        "d": "__undefined__"
    }
}

console.log('JEON input:')
console.log(JSON.stringify(jeon, null, 2))

try {
    const context: Record<string, any> = {}
    const result = evalJeon(jeon, context)
    console.log('\nResult:', result)
    console.log('Context after evaluation:', context)

    // Check that d is set to undefined in the context
    if ('d' in context && context.d === undefined) {
        console.log('✅ Variable d correctly set to undefined in context')
    } else {
        console.log('❌ Variable d not correctly set to undefined in context')
    }

    // Check that the statement returns undefined
    if (result === undefined) {
        console.log('✅ Variable declaration statement correctly returns undefined')
    } else {
        console.log('❌ Variable declaration statement should return undefined')
    }

} catch (e: any) {
    console.log('Error:', e.message)
    console.log(e.stack)
}