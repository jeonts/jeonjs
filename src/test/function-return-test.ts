import { evalJeon } from '../safeEval'

console.log('=== Function Return Value Test ===\n')

// Test 1: console.log returns undefined
console.log('Test 1: console.log returns undefined')
const consoleJeon = {
    '()': [
        {
            '.': ['@console', 'log']
        },
        'Hello from console.log!'
    ]
}
try {
    const result1 = evalJeon(consoleJeon, {})
    console.log('console.log result:', result1)
    console.log('Type of result:', typeof result1)
    console.log('\x1b[32m%s\x1b[0m', result1 === undefined ? '✅ CORRECT' : '❌ UNEXPECTED')
} catch (error: any) {
    console.log('Error:', error.message)
    console.log('\x1b[31m%s\x1b[0m', '❌ FAILED')
}

// Test 2: Math.abs returns a number
console.log('\nTest 2: Math.abs returns a number')
const mathJeon = {
    '()': [
        {
            '.': ['@Math', 'abs']
        },
        -42
    ]
}
try {
    const result2 = evalJeon(mathJeon, {})
    console.log('Math.abs(-42) result:', result2)
    console.log('Type of result:', typeof result2)
    console.log('\x1b[32m%s\x1b[0m', result2 === 42 ? '✅ CORRECT' : '❌ UNEXPECTED')
} catch (error: any) {
    console.log('Error:', error.message)
    console.log('\x1b[31m%s\x1b[0m', '❌ FAILED')
}

// Test 3: Custom function that returns a string
console.log('\nTest 3: Custom function that returns a string')
const customContext = {
    greet: (name: string) => `Hello, ${name}!`
}
const greetJeon = {
    '()': ['@greet', 'World']
}
try {
    const result3 = evalJeon(greetJeon, customContext)
    console.log('greet("World") result:', result3)
    console.log('Type of result:', typeof result3)
    console.log('\x1b[32m%s\x1b[0m', result3 === 'Hello, World!' ? '✅ CORRECT' : '❌ UNEXPECTED')
} catch (error: any) {
    console.log('Error:', error.message)
    console.log('\x1b[31m%s\x1b[0m', '❌ FAILED')
}

console.log('\n=== Test Complete ===')