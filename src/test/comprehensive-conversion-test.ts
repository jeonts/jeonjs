// Comprehensive test for non-IIFE to IIFE conversion with specific return handling
//
// This test validates all the specific conversion cases mentioned in the requirements:
// 1. Expression statements -> return the expression value
// 2. Function declarations -> return object with function name
// 3. Arrow functions -> return the function itself
// 4. Explicit returns -> maintain exactly as-is
// 5. Various combinations of single/multiple statements

import { convertToIIFE } from '../iifeConverter'

// Define test case types
interface PatternTestCase {
    name: string
    input: string
    expectedPattern: string
}

interface ContainsTestCase {
    name: string
    input: string
    expectedContains: string
}

type TestCase = PatternTestCase | ContainsTestCase

// Test cases organized by the specific requirements
const testGroups: { [key: string]: TestCase[] } = {
    "Expression Statements": [
        {
            name: "Simple arithmetic expression",
            input: "const a = 1;\n\nconst b = 2;\n\na + b;",
            expectedPattern: "return a + b;"
        },
        {
            name: "Single expression",
            input: "42 + 8;",
            expectedPattern: "return 42 + 8;"
        }
    ],

    "Function Declarations": [
        {
            name: "Named function",
            input: "function sum() {}",
            expectedPattern: "return {sum};"
        },
        {
            name: "Named class",
            input: "class MyClass {}",
            expectedPattern: "return {MyClass};"
        }
    ],

    "Arrow Functions": [
        {
            name: "Anonymous arrow function",
            input: "() => {}",
            expectedPattern: "return () => {};"
        }
    ],

    "Explicit Returns": [
        {
            name: "Object literal return",
            input: "return {a, b};",
            expectedContains: "return {a, b};"
        },
        {
            name: "Array literal return",
            input: "return [1, 3];",
            expectedContains: "return [1, 3];"
        },
        {
            name: "Primitive return",
            input: "return 42;",
            expectedContains: "return 42;"
        }
    ],

    "Mixed Statements": [
        {
            name: "Variable declarations with expression",
            input: "const a = 1;\nlet b = 2;\na + b;",
            expectedPattern: "return a + b;"
        },
        {
            name: "Function declaration with expression",
            input: "function helper() {}\n5 * 3;",
            expectedPattern: "return 5 * 3;"
        }
    ]
}

console.log('=== Comprehensive Non-IIFE to IIFE Conversion Test ===\n')

let passedTests = 0
let totalTests = 0

// Helper function to check if test case has expectedPattern
function hasExpectedPattern(test: TestCase): test is PatternTestCase {
    return 'expectedPattern' in test
}

// Helper function to check if test case has expectedContains
function hasExpectedContains(test: TestCase): test is ContainsTestCase {
    return 'expectedContains' in test
}

// Run all test groups
for (const [groupName, tests] of Object.entries(testGroups)) {
    console.log(`\n${groupName}:`)
    console.log('='.repeat(groupName.length + 1))

    for (const test of tests) {
        totalTests++
        console.log(`\nTest: ${test.name}`)
        console.log('Input:')
        console.log(test.input)

        try {
            const result = convertToIIFE(test.input)
            console.log('Output:')
            console.log(result)

            // Validate the result
            let passed = false

            if (hasExpectedPattern(test)) {
                // Check if the expected pattern exists in the result
                passed = result.includes(test.expectedPattern)
                if (!passed) {
                    console.log(`❌ FAILED: Expected pattern "${test.expectedPattern}" not found`)
                }
            } else if (hasExpectedContains(test)) {
                // Check if the result contains the expected string
                passed = result.includes(test.expectedContains)
                if (!passed) {
                    console.log(`❌ FAILED: Expected to contain "${test.expectedContains}"`)
                }
            } else {
                // Just check that it's a valid IIFE
                passed = result.startsWith('(() => {') && result.endsWith('})()')
                if (!passed) {
                    console.log('❌ FAILED: Not a valid IIFE format')
                }
            }

            if (passed) {
                console.log('✅ PASSED')
                passedTests++
            }

        } catch (error: any) {
            console.log(`❌ FAILED: ${error.message}`)
        }

        console.log('-'.repeat(40))
    }
}

console.log(`\n=== Test Summary ===`)
console.log(`Passed: ${passedTests}/${totalTests}`)
console.log(`Failed: ${totalTests - passedTests}/${totalTests}`)
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`)

// Additional validation examples
console.log('\n=== Validation Examples ===')

const validationExamples = [
    {
        name: "Original example from requirements",
        input: "const a = 1;\n\nconst b = 2;\n\na + b;",
        description: "Should convert to IIFE with 'return a + b;'"
    },
    {
        name: "Function declaration example",
        input: "function sum(){}",
        description: "Should convert to IIFE with 'return {sum}'"
    },
    {
        name: "Arrow function example",
        input: "()=>{}",
        description: "Should convert to IIFE with 'return ()=>{}'"
    }
]

validationExamples.forEach((example, index) => {
    console.log(`\nValidation ${index + 1}: ${example.name}`)
    console.log(`Description: ${example.description}`)
    console.log('Input:')
    console.log(example.input)
    console.log('Converted:')
    console.log(convertToIIFE(example.input))
})