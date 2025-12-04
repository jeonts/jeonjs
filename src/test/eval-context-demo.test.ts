import { evalJeon } from '../safeEval'

console.log('=== evalJeon with Rich Context Demo ===\n')

// Demo 1: Using Math functions in context
console.log('Demo 1: Using Math functions in context')
const mathJeon = {
    '()': [
        {
            '.': ['@Math', 'abs']
        },
        -5
    ]
}
const mathContext = { Math }
try {
    const mathResult = evalJeon(mathJeon, mathContext)
    console.log('Math.abs(-5) result:', mathResult)
    console.log('\x1b[32m%s\x1b[0m', '✅ PASSED')
} catch (error: any) {
    console.log('Error in math demo:', error.message)
    console.log('\x1b[31m%s\x1b[0m', '❌ FAILED')
}

// Demo 2: Using console in context (this works because console is in safeContext)
console.log('\nDemo 2: Using console in context')
const consoleJeon = {
    '()': [
        {
            '.': ['@console', 'log']
        },
        'Hello from JEON!'
    ]
}
// Note: We don't need to provide console in context since it's in safeContext
try {
    const consoleResult = evalJeon(consoleJeon, {})
    console.log('Console log result:', consoleResult)
    console.log('\x1b[32m%s\x1b[0m', '✅ PASSED')
} catch (error: any) {
    console.log('Error in console demo:', error.message)
    console.log('\x1b[31m%s\x1b[0m', '❌ FAILED')
}

// Demo 3: Creating and using Date objects
console.log('\nDemo 3: Creating and using Date objects')
const dateContext = { Date }
const dateJeon = {
    'new': ['@Date']
}
try {
    const dateResult = evalJeon(dateJeon, dateContext)
    console.log('New Date result:', dateResult instanceof Date ? '[Date object]' : dateResult)
    console.log('\x1b[32m%s\x1b[0m', '✅ PASSED')
} catch (error: any) {
    console.log('Error in date demo:', error.message)
    console.log('\x1b[31m%s\x1b[0m', '❌ FAILED')
}

// Demo 4: Using custom functions in context
console.log('\nDemo 4: Using custom functions in context')
const customContext = {
    add: (a: number, b: number) => a + b,
    multiply: (a: number, b: number) => a * b
}
const functionJeon = {
    '+': [
        {
            '()': ['@add', 5, 3]
        },
        {
            '()': ['@multiply', 2, 4]
        }
    ]
}
try {
    const functionResult = evalJeon(functionJeon, customContext)
    console.log('Custom functions result:', functionResult)
    console.log('\x1b[32m%s\x1b[0m', '✅ PASSED')
} catch (error: any) {
    console.log('Error in function demo:', error.message)
    console.log('\x1b[31m%s\x1b[0m', '❌ FAILED')
}

// Demo 5: Complex expression with multiple context objects
console.log('\nDemo 5: Complex expression with multiple context objects')
const complexContext = {
    Math: Math,
    x: 10,
    y: 5
}
const complexJeon = {
    '()': [
        {
            '.': ['@Math', 'pow']
        },
        {
            '+': ['@x', '@y']
        },
        2
    ]
} as any // Type assertion to avoid TS errors
try {
    const complexResult = evalJeon(complexJeon, complexContext)
    console.log('Complex expression result:', complexResult)
    console.log('\x1b[32m%s\x1b[0m', '✅ PASSED')
} catch (error: any) {
    console.log('Error in complex demo:', error.message)
    console.log('\x1b[31m%s\x1b[0m', '❌ FAILED')
}

console.log('\n=== Demo Complete ===')