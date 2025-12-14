import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { evalJeon } from '../safeEval'

console.log('=== Testing Arrow Function Format ===\n')

// Test case 1: Simple arrow function with no parameters
console.log('1. Testing arrow function with no parameters:')
const code1 = 'const fn = () => 42; fn()'
console.log(`Code: ${code1}`)

try {
    const jeon1 = js2jeon(code1)
    console.log('JEON:', JSON.stringify(jeon1, null, 2))

    const js1 = jeon2js(jeon1)
    console.log('JS:', js1)

    const result1 = evalJeon(jeon1)
    console.log('Result:', result1)
    console.log('✅ Success\n')
} catch (error: any) {
    console.log('❌ Error:', error.message, '\n')
}

// Test case 2: Arrow function with parameters
console.log('2. Testing arrow function with parameters:')
const code2 = 'const add = (a, b) => a + b; add(2, 3)'
console.log(`Code: ${code2}`)

try {
    const jeon2 = js2jeon(code2)
    console.log('JEON:', JSON.stringify(jeon2, null, 2))

    const js2 = jeon2js(jeon2)
    console.log('JS:', js2)

    const result2 = evalJeon(jeon2)
    console.log('Result:', result2)
    console.log('✅ Success\n')
} catch (error: any) {
    console.log('❌ Error:', error.message, '\n')
}

// Test case 3: Arrow function with block body
console.log('3. Testing arrow function with block body:')
const code3 = 'const multiply = (x, y) => { return x * y; }; multiply(4, 5)'
console.log(`Code: ${code3}`)

try {
    const jeon3 = js2jeon(code3)
    console.log('JEON:', JSON.stringify(jeon3, null, 2))

    const js3 = jeon2js(jeon3)
    console.log('JS:', js3)

    const result3 = evalJeon(jeon3)
    console.log('Result:', result3)
    console.log('✅ Success\n')
} catch (error: any) {
    console.log('❌ Error:', error.message, '\n')
}

// Test case 4: Direct JEON arrow function
console.log('4. Testing direct JEON arrow function:')
const jeon4 = {
    "@": {
        "fn": {
            "()=>": 42
        }
    },
    "()": ["@fn"]
}

console.log('JEON:', JSON.stringify(jeon4, null, 2))

try {
    const js4 = jeon2js(jeon4)
    console.log('JS:', js4)

    const result4 = evalJeon(jeon4)
    console.log('Result:', result4)
    console.log('✅ Success\n')
} catch (error: any) {
    console.log('❌ Error:', error.message, '\n')
}

// Test case 5: Direct JEON arrow function with parameters
console.log('5. Testing direct JEON arrow function with parameters:')
const jeon5 = {
    "@": {
        "add": {
            "(a, b) =>": {
                "+": ["@a", "@b"]
            }
        }
    },
    "()": ["@add", 3, 4]
}

console.log('JEON:', JSON.stringify(jeon5, null, 2))

try {
    const js5 = jeon2js(jeon5)
    console.log('JS:', js5)

    const result5 = evalJeon(jeon5)
    console.log('Result:', result5)
    console.log('✅ Success\n')
} catch (error: any) {
    console.log('❌ Error:', error.message, '\n')
}

console.log('=== Test Completed ===')