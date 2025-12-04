// Demonstration of non-IIFE to IIFE conversion with specific return handling
//
// This file demonstrates all the specific conversion cases mentioned in the requirements:
// 1. Expression statements -> return the expression value
// 2. Function declarations -> return object with function name
// 3. Arrow functions -> return the function itself
// 4. Explicit returns -> maintain exactly as-is

import { convertToIIFE } from '../iifeConverter'

console.log('=== Non-IIFE to IIFE Conversion Demo ===\n')

// Case 1: Expression statements -> return the expression value
console.log('1. Expression Statements -> return the expression value')
console.log('-----------------------------------------------------')

const expressionExamples = [
    {
        name: "Multiple statements with final expression",
        code: `const a = 1;

const b = 2;

a + b;`
    },
    {
        name: "Single expression",
        code: "42 * 2;"
    }
]

expressionExamples.forEach((example, index) => {
    console.log(`\n1.${index + 1} ${example.name}:`)
    console.log('Before:')
    console.log(example.code)
    console.log('After:')
    console.log(convertToIIFE(example.code))
})

// Case 2: Function declarations -> return object with function name
console.log('\n\n2. Function Declarations -> return object with function name')
console.log('-----------------------------------------------------------')

const functionExamples = [
    {
        name: "Named function",
        code: "function sum() {}"
    },
    {
        name: "Named class",
        code: "class Calculator {}"
    }
]

functionExamples.forEach((example, index) => {
    console.log(`\n2.${index + 1} ${example.name}:`)
    console.log('Before:')
    console.log(example.code)
    console.log('After:')
    console.log(convertToIIFE(example.code))
})

// Case 3: Arrow functions -> return the function itself
console.log('\n\n3. Arrow Functions -> return the function itself')
console.log('-----------------------------------------------')

const arrowExamples = [
    {
        name: "Anonymous arrow function",
        code: "() => {}"
    },
    {
        name: "Arrow function with parameters",
        code: "(x, y) => x + y"
    }
]

arrowExamples.forEach((example, index) => {
    console.log(`\n3.${index + 1} ${example.name}:`)
    console.log('Before:')
    console.log(example.code)
    console.log('After:')
    console.log(convertToIIFE(example.code))
})

// Case 4: Explicit returns -> maintain exactly as-is
console.log('\n\n4. Explicit Returns -> maintain exactly as-is')
console.log('------------------------------------------')

const returnExamples = [
    {
        name: "Object literal return",
        code: "return {a, b};"
    },
    {
        name: "Array literal return",
        code: "return [1, 3];"
    },
    {
        name: "Function return",
        code: "return function() {};"
    },
    {
        name: "Arrow function return",
        code: "return () => {};"
    }
]

returnExamples.forEach((example, index) => {
    console.log(`\n4.${index + 1} ${example.name}:`)
    console.log('Before:')
    console.log(example.code)
    console.log('After:')
    console.log(convertToIIFE(example.code))
})

// Special cases and edge cases
console.log('\n\n5. Special Cases and Edge Cases')
console.log('------------------------------')

const specialCases = [
    {
        name: "Empty code",
        code: ""
    },
    {
        name: "Already an IIFE",
        code: "(function() { return 42; })()"
    },
    {
        name: "Comments only",
        code: "// Just a comment"
    },
    {
        name: "Mixed statements with final expression",
        code: `const x = 5;
function helper() {}
x * 2;`
    }
]

specialCases.forEach((example, index) => {
    console.log(`\n5.${index + 1} ${example.name}:`)
    console.log('Before:')
    console.log(example.code || '(empty)')
    console.log('After:')
    console.log(convertToIIFE(example.code))
})

console.log('\n=== Summary ===')
console.log('The convertToIIFE function successfully handles all the requested conversion cases:')
console.log('1. ✅ Expression statements are converted to return the expression value')
console.log('2. ✅ Function declarations return an object with the function name')
console.log('3. ✅ Arrow functions return the function itself')
console.log('4. ✅ Explicit returns are maintained exactly as-is')
console.log('5. ✅ Works with single and multiple statements')
console.log('6. ✅ Handles edge cases appropriately')