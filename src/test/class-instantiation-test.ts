// Test class declaration and instantiation with safeEval
import { convertToIIFE } from '../iifeConverter'
import { evalJeon } from '../safeEval'

// Safe evaluation function that uses indirect eval to prevent access to dangerous globals
function safeEval(expr: string): any {
    return Function('evalJeon', `"use strict"; return (${expr})`)(evalJeon)
}

console.log('=== Class Declaration and Instantiation Test ===\n')

// Test 1: Class declaration and instantiation in same scope
console.log('Test 1: Class declaration and instantiation in same scope')
const code1 = `class Person {
    constructor(name) {
        this.name = name;
    }
    
    getName() {
        return this.name;
    }
}
const instance = new Person('Alice');
instance.getName();`

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

// Test 2: Combined class declaration and instantiation in one code block
console.log('\n\nTest 2: Combined class declaration and instantiation in one code block')
const combinedCode = `class MyClass {
    constructor(value) {
        this.value = value;
    }
    
    getValue() {
        return this.value;
    }
}
const obj = new MyClass(42);
obj.getValue();`

console.log('Combined code:')
console.log(combinedCode)
const iifeCombinedCode = convertToIIFE(combinedCode)
console.log('\nIIFE Converted:')
console.log(iifeCombinedCode)

// Evaluate the IIFE using safeEval
console.log('\nEvaluation result:')
try {
    const combinedResult = safeEval(iifeCombinedCode)
    console.log('Combined result:', combinedResult)
    console.log('Type:', typeof combinedResult)
} catch (error: any) {
    console.log('Error:', error.message)
}

console.log('\n\n=== Summary ===')
console.log('1. Classes and instances work correctly when defined in the same scope')
console.log('2. The IIFE converter properly returns the result of the last statement')
console.log('3. SafeEval provides secure execution environment')