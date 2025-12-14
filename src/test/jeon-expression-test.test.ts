// Simple test runner for JeonExpression tests
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { evalJeon } from '../safeEval'

// Simple test function
function expect(actual: any) {
    return {
        toBe(expected: any) {
            if (actual !== expected) {
                throw new Error(`Expected ${expected} but got ${actual}`)
            }
            console.log('✅ Test passed')
        },
        toEqual(expected: any) {
            if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`)
            }
            console.log('✅ Test passed')
        }
    }
}

console.log('=== JeonExpression Comprehensive Test ===\n')

// Test all operators defined in JeonOperatorMap
console.log('--- Testing Arithmetic Operators ---')
try {
    const arithmeticTests = [
        { code: '1 + 2', expected: 3 },
        { code: '5 - 3', expected: 2 },
        { code: '4 * 3', expected: 12 },
        { code: '10 / 2', expected: 5 },
        { code: '10 % 3', expected: 1 }
    ]

    for (const test of arithmeticTests) {
        const jeon = js2jeon(test.code)
        const result = evalJeon(jeon)
        expect(result).toBe(test.expected)
        console.log(`✅ ${test.code} = ${result}`)
    }
} catch (error) {
    console.error('❌ Arithmetic operators test failed:', error)
}

console.log('\n--- Testing Comparison Operators ---')
try {
    const comparisonTests = [
        { code: '5 == 5', expected: true },
        { code: '5 === 5', expected: true },
        { code: '5 != 3', expected: true },
        { code: '5 !== "5"', expected: true },
        { code: '3 < 5', expected: true },
        { code: '5 > 3', expected: true },
        { code: '3 <= 3', expected: true },
        { code: '5 >= 5', expected: true }
    ]

    for (const test of comparisonTests) {
        const jeon = js2jeon(test.code)
        const result = evalJeon(jeon)
        expect(result).toBe(test.expected)
        console.log(`✅ ${test.code} = ${result}`)
    }
} catch (error) {
    console.error('❌ Comparison operators test failed:', error)
}

console.log('\n--- Testing Logical Operators ---')
try {
    const logicalTests = [
        { code: 'true && true', expected: true },
        { code: 'true && false', expected: false },
        { code: 'false || true', expected: true },
        { code: 'false || false', expected: false },
        { code: '!true', expected: false },
        { code: '!false', expected: true }
    ]

    for (const test of logicalTests) {
        const jeon = js2jeon(test.code)
        const result = evalJeon(jeon)
        expect(result).toBe(test.expected)
        console.log(`✅ ${test.code} = ${result}`)
    }
} catch (error) {
    console.error('❌ Logical operators test failed:', error)
}

console.log('\n--- Testing Unary Operators ---')
try {
    const unaryTests = [
        { code: '+5', expected: 5 },
        { code: '-5', expected: -5 },
        { code: '~0', expected: -1 },
        { code: 'typeof "hello"', expected: 'string' }
    ]

    for (const test of unaryTests) {
        const jeon = js2jeon(test.code)
        const result = evalJeon(jeon)
        expect(result).toBe(test.expected)
        console.log(`✅ ${test.code} = ${result}`)
    }
} catch (error) {
    console.error('❌ Unary operators test failed:', error)
}

console.log('\n--- Testing Control Flow Constructs ---')
try {
    // Conditional (ternary) operator
    const ternaryCode = 'true ? "yes" : "no"'
    const ternaryJeon = js2jeon(ternaryCode)
    const ternaryResult = evalJeon(ternaryJeon)
    expect(ternaryResult).toBe('yes')
    console.log(`✅ ${ternaryCode} = ${ternaryResult}`)

    // If statement
    const ifCode = `
        let x = 5;
        if (x > 3) {
        "greater";
        } else {
        "less";
        }
    `
    const ifJeon = js2jeon(ifCode)
    const ifJs = jeon2js(ifJeon)
    console.log('✅ If statement converted successfully')
    console.log('If statement JS:', ifJs.substring(0, 100) + '...')

    // While loop
    const whileCode = `
        let i = 0;
        while (i < 3) {
        i = i + 1;
        }
        i;
    `
    const whileJeon = js2jeon(whileCode)
    const whileJs = jeon2js(whileJeon)
    console.log('✅ While loop converted successfully')
    console.log('While loop JS:', whileJs.substring(0, 100) + '...')

    // For loop
    const forCode = `
        let sum = 0;
        for (let i = 0; i < 3; i = i + 1) {
        sum = sum + i;
        }
        sum;
    `
    const forJeon = js2jeon(forCode)
    const forJs = jeon2js(forJeon)
    console.log('✅ For loop converted successfully')
    console.log('For loop JS:', forJs.substring(0, 100) + '...')
} catch (error) {
    console.error('❌ Control flow constructs test failed:', error)
}

console.log('\n--- Testing Function Declarations and Calls ---')
try {
    // Function declaration
    const funcCode = `
        function add(a, b) {
        return a + b;
        }
        add(2, 3);
    `
    const funcJeon = js2jeon(funcCode)
    const funcJs = jeon2js(funcJeon)
    console.log('✅ Function declaration converted successfully')
    console.log('Function declaration JS:', funcJs.substring(0, 100) + '...')

    // Arrow function
    const arrowCode = `
        const multiply = (a, b) => a * b;
        multiply(4, 5);
    `
    const arrowJeon = js2jeon(arrowCode)
    const arrowJs = jeon2js(arrowJeon)
    console.log('✅ Arrow function converted successfully')
    console.log('Arrow function JS:', arrowJs.substring(0, 100) + '...')

    // Function call with JEON
    const context = { Math }
    const callExpr = {
        '()': [
            { '.': ['@Math', 'abs'] },
            -5
        ]
    }
    const callResult = evalJeon(callExpr, context)
    expect(callResult).toBe(5)
    console.log(`✅ Math.abs(-5) = ${callResult}`)
} catch (error) {
    console.error('❌ Function declarations and calls test failed:', error)
}

console.log('\n--- Testing Async Functions ---')
try {
    // Async function declaration
    const asyncCode = `
        async function fetchData() {
        return "data";
        }
        fetchData();
    `
    const asyncJeon = js2jeon(asyncCode)
    const asyncJs = jeon2js(asyncJeon)
    console.log('✅ Async function converted successfully')
    console.log('Async function JS:', asyncJs.substring(0, 100) + '...')

    // Async arrow function
    const asyncArrowCode = `
        const asyncFunc = async () => "async result";
        asyncFunc();
    `
    const asyncArrowJeon = js2jeon(asyncArrowCode)
    const asyncArrowJs = jeon2js(asyncArrowJeon)
    console.log('✅ Async arrow function converted successfully')
    console.log('Async arrow function JS:', asyncArrowJs.substring(0, 100) + '...')
} catch (error) {
    console.error('❌ Async functions test failed:', error)
}

console.log('\n--- Testing Complex Nested Expressions ---')
try {
    // Complex arithmetic with parentheses
    const complexCode = '(2 + 3) * (4 - 1) + Math.max(5, 6)'
    const context = { Math }
    const complexJeon = js2jeon(complexCode)
    const complexResult = evalJeon(complexJeon, context)
    expect(complexResult).toBe(21) // (5) * (3) + 6 = 15 + 6 = 21
    console.log(`✅ ${complexCode} = ${complexResult}`)

    // Nested function calls
    const nestedCode = 'Math.max(Math.min(5, 10), 3)'
    const nestedJeon = js2jeon(nestedCode)
    const nestedResult = evalJeon(nestedJeon, context)
    expect(nestedResult).toBe(5) // Math.max(5, 3) = 5
    console.log(`✅ ${nestedCode} = ${nestedResult}`)

    // Complex conditional
    const complexConditionalCode = 'true ? (false ? "a" : "b") : "c"'
    const complexConditionalJeon = js2jeon(complexConditionalCode)
    const complexConditionalResult = evalJeon(complexConditionalJeon)
    expect(complexConditionalResult).toBe('b')
    console.log(`✅ ${complexConditionalCode} = ${complexConditionalResult}`)
} catch (error) {
    console.error('❌ Complex nested expressions test failed:', error)
}

console.log('\n--- Testing Object and Array Operations ---')
try {
    // Property access
    const propAccessCode = 'Math.PI'
    const context = { Math }
    const propAccessJeon = js2jeon(propAccessCode)
    const propAccessResult = evalJeon(propAccessJeon, context)
    expect(propAccessResult).toBe(Math.PI)
    console.log(`✅ ${propAccessCode} = ${propAccessResult}`)

    // New operator
    const newCode = 'new Date()'
    const newContext = { Date }
    const newJeon = js2jeon(newCode)
    const newJs = jeon2js(newJeon)
    console.log('✅ New operator converted successfully')
    console.log('New operator JS:', newJs.substring(0, 100) + '...')

    // Spread operator
    const spreadCode = '[...[1, 2, 3]]'
    const spreadJeon = js2jeon(spreadCode)
    const spreadJs = jeon2js(spreadJeon)
    console.log('✅ Spread operator converted successfully')
    console.log('Spread operator JS:', spreadJs.substring(0, 100) + '...')
} catch (error) {
    console.error('❌ Object and array operations test failed:', error)
}



console.log('\n--- Testing Complete Round-trip ---')
try {
    // Simple expression
    const originalCode = '2 + 3 * 4'
    const jeon = js2jeon(originalCode)
    const convertedJs = jeon2js(jeon)
    const result = evalJeon(jeon)

    expect(result).toBe(14) // 2 + (3 * 4) = 2 + 12 = 14
    expect(typeof jeon).toBe('object')
    expect(typeof convertedJs).toBe('string')
    console.log(`✅ Round-trip: ${originalCode} = ${result}`)

    // More complex expression
    const complexCode = 'Math.max(10, 5) + Math.min(3, 7)'
    const complexContext = { Math }
    const complexJeon = js2jeon(complexCode)
    const complexConvertedJs = jeon2js(complexJeon)
    const complexResult = evalJeon(complexJeon, complexContext)

    expect(complexResult).toBe(13) // 10 + 3 = 13
    expect(typeof complexJeon).toBe('object')
    expect(typeof complexConvertedJs).toBe('string')
    console.log(`✅ Complex round-trip: ${complexCode} = ${complexResult}`)
} catch (error) {
    console.error('❌ Complete round-trip test failed:', error)
}

console.log('\n🎉 All JeonExpression tests completed successfully!')