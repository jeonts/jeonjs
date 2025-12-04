import { evalJeon } from '../safeEval'

console.log('=== Function Print Test ===\n')

// Test the provided JEON expression
const printFunctionJeon = {
    'function Print(name)': [
        {
            return: {
                '(': {
                    '+': [
                        'Hello, ',
                        '@name',
                    ],
                },
            },
        },
    ],
}

console.log('JEON Expression:')
console.log(JSON.stringify(printFunctionJeon, null, 2))

try {
    // Evaluate the function declaration
    const result = evalJeon(printFunctionJeon, {})
    console.log('\nResult type:', typeof result)
    console.log('Is function:', typeof result === 'function')

    if (typeof result === 'function') {
        console.log('\nTesting function with name "Alice":')
        const callResult = result('Alice')
        console.log('Function call result:', callResult)
        console.log('\x1b[32m%s\x1b[0m', '✅ PASSED')
    } else {
        console.log('Result:', result)
        console.log('\x1b[31m%s\x1b[0m', '❌ FAILED - Expected function')
    }
} catch (error: any) {
    console.log('Error:', error.message)
    console.log('\x1b[31m%s\x1b[0m', '❌ FAILED')
}

console.log('\n=== Test Complete ===')