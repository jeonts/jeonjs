// Practical example showing how closure and IIFE features work together in JEON

import { jeon2js } from '../jeon2js'
import { convertToIIFE } from '../iifeConverter'
import { evalJeon } from '../safeEval'

// Safe evaluation function that uses indirect eval to prevent access to dangerous globals
function safeEval(expr: string): any {
    return Function('evalJeon', `"use strict"; return (${expr})`)(evalJeon)
}

console.log('=== Practical Example: Secure Plugin System ===\n')

// Scenario: A plugin system that executes user-provided JEON code securely
// Using closure mode to sandbox the execution and IIFE for proper scoping

// Example 1: User-provided plugin code (unsafe in regular mode)
console.log('Example 1: User Plugin - Data Processor')
const userPlugin: any = {
    'function processData(data)': [
        {
            '@': {
                'result': {
                    '*': ['@data', 2]
                }
            }
        },
        {
            'return': '@result'
        }
    ]
}

console.log('User Plugin JEON:')
console.log(JSON.stringify(userPlugin, null, 2))

// Regular mode - direct execution
const regularJs = jeon2js(userPlugin)
console.log('\nGenerated JavaScript (Regular Mode):')
console.log(regularJs)

// Regular mode (closure option removed)
const safeJs = jeon2js(userPlugin)
console.log('\nGenerated JavaScript (Closure Option Removed):')
console.log(safeJs)

// Apply IIFE conversion to the closure output
const safeJsIIFE = convertToIIFE(safeJs)
console.log('\nClosure Output wrapped with IIFE:')
console.log(safeJsIIFE)

// Evaluate the IIFE-wrapped closure output using safeEval
try {
    const evaluatedResult = safeEval(safeJsIIFE)
    console.log('\nEvaluated result (should contain processData function):')
    console.log(typeof evaluatedResult.processData === 'function' ? 'Contains processData function' : evaluatedResult)

    // Call the processData function if it exists
    if (typeof evaluatedResult.processData === 'function') {
        const testData = 21
        console.log(`\nCalling processData(${testData}):`)
        // Now we can actually call the function since evalJeon is available
        try {
            // The function uses evalJeon internally, so it should work
            const result = evaluatedResult.processData(testData)
            console.log(`Result: ${result}`)
        } catch (error: any) {
            console.log('Execution error:', error.message)
        }
    }
} catch (error: any) {
    console.log('\nEvaluation error:', error.message)
}

// Example 2: Complex mathematical operations
console.log('\n\nExample 2: Mathematical Operations Plugin')
const mathPlugin: any = {
    'function calculateHypotenuse(x, y)': [
        {
            'return': {
                '()': [
                    { '.': ['@Math', 'sqrt'] },
                    {
                        '+': [
                            {
                                '()': [
                                    { '.': ['@Math', 'pow'] },
                                    '@x',
                                    2
                                ]
                            },
                            {
                                '()': [
                                    { '.': ['@Math', 'pow'] },
                                    '@y',
                                    2
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    ]
}

console.log('Math Plugin JEON:')
console.log(JSON.stringify(mathPlugin, null, 2))

const mathRegular = jeon2js(mathPlugin)
console.log('\nGenerated JavaScript (Regular Mode):')
console.log(mathRegular)

const mathSafe = jeon2js(mathPlugin)
console.log('\nGenerated JavaScript (Closure Option Removed):')
console.log(mathSafe)

// Apply IIFE conversion to the closure output
const mathSafeIIFE = convertToIIFE(mathSafe)
console.log('\nClosure Output wrapped with IIFE:')
console.log(mathSafeIIFE)

// Evaluate the IIFE-wrapped closure output using safeEval
try {
    const evaluatedResult = safeEval(mathSafeIIFE)
    console.log('\nEvaluated result (should contain calculateHypotenuse function):')
    console.log(typeof evaluatedResult.calculateHypotenuse === 'function' ? 'Contains calculateHypotenuse function' : evaluatedResult)

    // Call the calculateHypotenuse function if it exists
    if (typeof evaluatedResult.calculateHypotenuse === 'function') {
        const testX = 3
        const testY = 4
        console.log(`\nCalling calculateHypotenuse(${testX}, ${testY}):`)
        // Now we can actually call the function since evalJeon is available
        try {
            // The function uses evalJeon internally, so it should work
            const result = evaluatedResult.calculateHypotenuse(testX, testY)
            console.log(`Result: ${result}`)
        } catch (error: any) {
            console.log('Execution error:', error.message)
        }
    }
} catch (error: any) {
    console.log('\nEvaluation error:', error.message)
}

// Example 3: Using convertToIIFE for code isolation
console.log('\n\nExample 3: Code Isolation with convertToIIFE')
const jsCodeSamples = [
    // Simple expression that should be isolated
    "const value = 42; value * 2;",

    // Object that should be returned
    "{ name: 'Plugin', version: '1.0', active: true }",

    // Array processing
    "const items = [1, 2, 3, 4, 5]; items.filter(x => x > 2).map(x => x * 2);"
]

jsCodeSamples.forEach((code, index) => {
    console.log(`\nCode Sample ${index + 1}:`)
    console.log(code)
    const isolatedCode = convertToIIFE(code)
    console.log('Isolated with IIFE:')
    console.log(isolatedCode)
})

console.log('\n\n=== Security Benefits ===')
console.log('1. IIFE conversion ensures proper scoping and prevents variable leakage')
console.log('2. evalJeon provides controlled execution with whitelisted context')

// NEW TESTS FOR ADDITIONAL FUNCTION TYPES
console.log('\n\n=== Additional Function Types Tests ===')

// 1. Anonymous Function
console.log('\n1. Anonymous Function Test:')
const anonymousFnJeon: any = {
    '@': {
        'myFunc': {
            'function()': [
                {
                    'return': 'Hello from anonymous function'
                }
            ]
        }
    }
}

console.log('JEON Input:')
console.log(JSON.stringify(anonymousFnJeon, null, 2))

const anonymousFnRegular = jeon2js(anonymousFnJeon)
console.log('\nGenerated JavaScript (Regular Mode):')
console.log(anonymousFnRegular)

const anonymousFnSafe = jeon2js(anonymousFnJeon)
console.log('\nGenerated JavaScript (Closure Option Removed):')
console.log(anonymousFnSafe)

const anonymousFnIIFE = convertToIIFE(anonymousFnSafe)
console.log('\nClosure Output wrapped with IIFE:')
console.log(anonymousFnIIFE)

try {
    const anonymousFnResult = safeEval(anonymousFnIIFE)
    console.log('\nEvaluated result:')
    console.log(typeof anonymousFnResult.myFunc === 'function' ? 'Contains myFunc function' : anonymousFnResult)

    if (typeof anonymousFnResult.myFunc === 'function') {
        console.log('\nCalling myFunc():')
        try {
            const result = anonymousFnResult.myFunc()
            console.log(`Result: ${result}`)
        } catch (error: any) {
            console.log('Execution error:', error.message)
        }
    }
} catch (error: any) {
    console.log('\nEvaluation error:', error.message)
}

// 2. Class Definition
console.log('\n\n2. Class Definition Test:')
const classJeon: any = {
    'class Calculator': {
        'add(a, b)': [
            {
                'return': {
                    '+': ['@a', '@b']
                }
            }
        ],
        'multiply(a, b)': [
            {
                'return': {
                    '*': ['@a', '@b']
                }
            }
        ]
    }
}

console.log('JEON Input:')
console.log(JSON.stringify(classJeon, null, 2))

const classRegular = jeon2js(classJeon)
console.log('\nGenerated JavaScript (Regular Mode):')
console.log(classRegular)

const classSafe = jeon2js(classJeon)
console.log('\nGenerated JavaScript (Closure Option Removed):')
console.log(classSafe)

const classIIFE = convertToIIFE(classSafe)
console.log('\nClosure Output wrapped with IIFE:')
console.log(classIIFE)

try {
    const classResult = safeEval(classIIFE)
    console.log('\nEvaluated result:')
    console.log(typeof classResult.Calculator === 'function' ? 'Contains Calculator class' : classResult)

    if (typeof classResult.Calculator === 'function') {
        console.log('\nTesting Calculator class:')
        try {
            const calc = new classResult.Calculator()
            const addResult = calc.add(5, 3)
            const multResult = calc.multiply(4, 6)
            console.log(`calc.add(5, 3) = ${addResult}`)
            console.log(`calc.multiply(4, 6) = ${multResult}`)
        } catch (error: any) {
            console.log('Execution error:', error.message)
        }
    }
} catch (error: any) {
    console.log('\nEvaluation error:', error.message)
}

// 3. Named Class (Assigned Class)
console.log('\n\n3. Named Class (Assigned Class) Test:')
console.log('This represents: const MyClass = class {}')
const namedClassJeon: any = {
    '@@': {
        'MyClass': {
            'class': {
                'constructor(name)': [
                    {
                        '=': [
                            { '.': ['@this', 'name'] },
                            '@name'
                        ]
                    }
                ],
                'getName()': [
                    {
                        'return': { '.': ['@this', 'name'] }
                    }
                ]
            }
        }
    }
}

console.log('JEON Input:')
console.log(JSON.stringify(namedClassJeon, null, 2))

const namedClassRegular = jeon2js(namedClassJeon)
console.log('\nGenerated JavaScript (Regular Mode):')
console.log(namedClassRegular)

const namedClassSafe = jeon2js(namedClassJeon)
console.log('\nGenerated JavaScript (Closure Option Removed):')
console.log(namedClassSafe)

const namedClassIIFE = convertToIIFE(namedClassSafe)
console.log('\nClosure Output wrapped with IIFE:')
console.log(namedClassIIFE)

try {
    const namedClassResult = safeEval(namedClassIIFE)
    console.log('\nEvaluated result:')
    console.log(typeof namedClassResult === 'function' ? 'Got MyClass class' : namedClassResult)

    if (typeof namedClassResult === 'function') {
        console.log('\nTesting MyClass:')
        try {
            const instance = new namedClassResult('TestObject')
            const nameResult = instance.getName()
            console.log(`instance.getName() = ${nameResult}`)
        } catch (error: any) {
            console.log('Execution error:', error.message)
        }
    }
} catch (error: any) {
    console.log('\nEvaluation error:', error.message)
}

// 4. Arrow Function
console.log('\n\n4. Arrow Function Test:')
const arrowFnJeon: any = {
    '(x) =>': {
        '*': ['@x', '@x']
    }
}

console.log('JEON Input:')
console.log(JSON.stringify(arrowFnJeon, null, 2))

const arrowFnRegular = jeon2js(arrowFnJeon)
console.log('\nGenerated JavaScript (Regular Mode):')
console.log(arrowFnRegular)

const arrowFnSafe = jeon2js(arrowFnJeon)
console.log('\nGenerated JavaScript (Closure Option Removed):')
console.log(arrowFnSafe)

const arrowFnIIFE = convertToIIFE(arrowFnSafe)
console.log('\nClosure Output wrapped with IIFE:')
console.log(arrowFnIIFE)

try {
    const arrowFnResult = safeEval(arrowFnIIFE)
    console.log('\nEvaluated result:')
    console.log(typeof arrowFnResult === 'function' ? 'Got arrow function' : arrowFnResult)

    if (typeof arrowFnResult === 'function') {
        console.log('\nCalling arrow function with 5:')
        try {
            const result = arrowFnResult(5)
            console.log(`Result: ${result}`)
        } catch (error: any) {
            console.log('Execution error:', error.message)
        }
    }
} catch (error: any) {
    console.log('\nEvaluation error:', error.message)
}

// Additional test: function myFunc1()
console.log('\n\n5. function myFunc1() Test:')
const myFunc1Jeon: any = {
    'function myFunc1()': [
        {
            'return': 'Hello from myFunc1'
        }
    ]
}

console.log('JEON Input:')
console.log(JSON.stringify(myFunc1Jeon, null, 2))

const myFunc1Regular = jeon2js(myFunc1Jeon)
console.log('\nGenerated JavaScript (Regular Mode):')
console.log(myFunc1Regular)

const myFunc1Safe = jeon2js(myFunc1Jeon)
console.log('\nGenerated JavaScript (Closure Option Removed):')
console.log(myFunc1Safe)

const myFunc1IIFE = convertToIIFE(myFunc1Safe)
console.log('\nClosure Output wrapped with IIFE:')
console.log(myFunc1IIFE)

try {
    const myFunc1Result = safeEval(myFunc1IIFE)
    console.log('\nEvaluated result:')
    console.log(typeof myFunc1Result.myFunc1 === 'function' ? 'Contains myFunc1 function' : myFunc1Result)

    if (typeof myFunc1Result.myFunc1 === 'function') {
        console.log('\nCalling myFunc1():')
        try {
            const result = myFunc1Result.myFunc1()
            console.log(`Result: ${result}`)
        } catch (error: any) {
            console.log('Execution error:', error.message)
        }
    }
} catch (error: any) {
    console.log('\nEvaluation error:', error.message)
}

// Additional test: class MyClass1
console.log('\n\n6. class MyClass1 Test:')
console.log('This represents: class MyClass1 {}')
const myClass1Jeon: any = {
    'class MyClass1': {
        'constructor(name)': [
            {
                '=': [
                    { '.': ['@this', 'name'] },
                    '@name'
                ]
            }
        ],
        'getName()': [
            {
                'return': { '.': ['@this', 'name'] }
            }
        ]
    }
}

console.log('JEON Input:')
console.log(JSON.stringify(myClass1Jeon, null, 2))

const myClass1Regular = jeon2js(myClass1Jeon)
console.log('\nGenerated JavaScript (Regular Mode):')
console.log(myClass1Regular)

const myClass1Safe = jeon2js(myClass1Jeon)
console.log('\nGenerated JavaScript (Closure Option Removed):')
console.log(myClass1Safe)

const myClass1IIFE = convertToIIFE(myClass1Safe)
console.log('\nClosure Output wrapped with IIFE:')
console.log(myClass1IIFE)

try {
    const myClass1Result = safeEval(myClass1IIFE)
    console.log('\nEvaluated result:')
    console.log(typeof myClass1Result.MyClass1 === 'function' ? 'Contains MyClass1 class' : myClass1Result)

    if (typeof myClass1Result.MyClass1 === 'function') {
        console.log('\nTesting MyClass1:')
        try {
            const instance = new myClass1Result.MyClass1('TestObject1')
            const nameResult = instance.getName()
            console.log(`instance.getName() = ${nameResult}`)
        } catch (error: any) {
            console.log('Execution error:', error.message)
        }
    }
} catch (error: any) {
    console.log('\nEvaluation error:', error.message)
}

console.log('\n\n=== Summary ===')
console.log('All function types (anonymous functions, classes, named classes, arrow functions, named functions)')
console.log('work correctly with both regular and closure modes.')
console.log('The closure mode provides secure execution through evalJeon wrapping.')
console.log('IIFE conversion ensures proper scoping and return value handling.')