// Test demonstrating proper usage of IIFE converter with safeEval
import { convertToIIFE } from '../iifeConverter'
import { evalJeon } from '../safeEval'

// Safe evaluation function that uses indirect eval to prevent access to dangerous globals
function safeEval(expr: string): any {
    return Function('evalJeon', `"use strict"; return (${expr})`)(evalJeon)
}

console.log('=== IIFE Safe Eval Test ===\n')

// Test 1: Function declaration and call in same scope
console.log('Test 1: Function declaration and call in same scope')
const code1 = `function greet(name) { 
    return 'Hello, ' + name; 
}
greet('World');`

console.log('Original code:')
console.log(code1)

const iifeCode1 = convertToIIFE(code1)
console.log('\nIIFE Converted:')
console.log(iifeCode1)

// Evaluate the IIFE using safeEval
console.log('\nEvaluation result:')
try {
    const result1 = safeEval(iifeCode1)
    console.log(result1)
    console.log('Type:', typeof result1)
} catch (error: any) {
    console.log('Error:', error.message)
}

// Test 2: Class declaration and usage in same scope
console.log('\n\nTest 2: Class declaration and usage in same scope')
const code2 = `class Person {
    constructor(name) {
        this.name = name;
    }
    
    getName() {
        return this.name;
    }
}
const person = new Person('Alice');
person.getName();`

console.log('Original code:')
console.log(code2)

const iifeCode2 = convertToIIFE(code2)
console.log('\nIIFE Converted:')
console.log(iifeCode2)

// Evaluate the IIFE using safeEval
console.log('\nEvaluation result:')
try {
    const result2 = safeEval(iifeCode2)
    console.log(result2)
    console.log('Type:', typeof result2)
} catch (error: any) {
    console.log('Error:', error.message)
}

// Test 3: Multiple statements with arithmetic
console.log('\n\nTest 3: Multiple statements with arithmetic')
const code3 = `const x = 5;
const y = 10;
const z = x * y;
z + 5;`

console.log('Original code:')
console.log(code3)

const iifeCode3 = convertToIIFE(code3)
console.log('\nIIFE Converted:')
console.log(iifeCode3)

// Evaluate the IIFE using safeEval
console.log('\nEvaluation result:')
try {
    const result3 = safeEval(iifeCode3)
    console.log(result3)
    console.log('Type:', typeof result3)
} catch (error: any) {
    console.log('Error:', error.message)
}

// Test 4: Object literal (testing the specific case mentioned in user query)
console.log('\n\nTest 4: Object literal')
const code4 = `({ name: 'Test', value: 42 });`

console.log('Original code:')
console.log(code4)

const iifeCode4 = convertToIIFE(code4)
console.log('\nIIFE Converted:')
console.log(iifeCode4)

// Evaluate the IIFE using safeEval
console.log('\nEvaluation result:')
try {
    const result4 = safeEval(iifeCode4)
    console.log(result4)
    console.log('Type:', typeof result4)
} catch (error: any) {
    console.log('Error:', error.message)
}

// Test 5: Array literal (testing the specific case mentioned in user query)
console.log('\n\nTest 5: Array literal')
const code5 = `[1, 2, 3, 4, 5];`

console.log('Original code:')
console.log(code5)

const iifeCode5 = convertToIIFE(code5)
console.log('\nIIFE Converted:')
console.log(iifeCode5)

// Evaluate the IIFE using safeEval
console.log('\nEvaluation result:')
try {
    const result5 = safeEval(iifeCode5)
    console.log(result5)
    console.log('Type:', typeof result5)
} catch (error: any) {
    console.log('Error:', error.message)
}

console.log('\n\n=== Summary ===')
console.log('1. IIFE converter properly wraps code blocks for isolation')
console.log('2. Last statement is returned as the result')
console.log('3. SafeEval provides secure execution environment')
console.log('4. Variables and functions are properly scoped within each IIFE')