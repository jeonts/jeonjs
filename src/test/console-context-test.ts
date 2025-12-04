import { evalJeon } from '../safeEval'

console.log('=== Console Context Test ===\n')

// Test 1: Using console from safeContext (empty context)
console.log('Test 1: Using console from safeContext')
const consoleJeon = {
    '()': [
        {
            '.': ['@console', 'log']
        },
        'Hello from safeContext!'
    ]
}
try {
    const result1 = evalJeon(consoleJeon, {})
    console.log('Result:', result1)
    console.log('\x1b[32m%s\x1b[0m', '✅ PASSED')
} catch (error: any) {
    console.log('Error:', error.message)
    console.log('\x1b[31m%s\x1b[0m', '❌ FAILED')
}

// Test 2: Using console from provided context
console.log('\nTest 2: Using console from provided context')
try {
    const result2 = evalJeon(consoleJeon, { console })
    console.log('Result:', result2)
    console.log('\x1b[32m%s\x1b[0m', '✅ PASSED')
} catch (error: any) {
    console.log('Error:', error.message)
    console.log('\x1b[31m%s\x1b[0m', '❌ FAILED')
}

// Test 3: Using a custom console object
console.log('\nTest 3: Using a custom console object')
const customConsole = {
    log: (message: string) => {
        console.log(`[CUSTOM] ${message}`)
        return 'custom-log-result'
    }
}
try {
    const result3 = evalJeon(consoleJeon, { console: customConsole })
    console.log('Result:', result3)
    console.log('\x1b[32m%s\x1b[0m', '✅ PASSED')
} catch (error: any) {
    console.log('Error:', error.message)
    console.log('\x1b[31m%s\x1b[0m', '❌ FAILED')
}

console.log('\n=== Test Complete ===')