import { convertToIIFE } from '../iifeConverter'
import { evalJeon } from '../safeEval'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'

// Safe evaluation function that uses indirect eval to prevent access to dangerous globals
function safeEval(expr: string): any {
    return Function('evalJeon', `"use strict"; return (${expr})`)(evalJeon)
}

// Test 1: Function declaration only
const code1 = `j
`

console.log('=== Test 1: Function declaration only ===')
console.log('Original code:')
console.log(code1)

let iifeCode1: string

// Convert JavaScript to JEON
console.log('\nConverting JavaScript to JEON:')
try {
    const jeon1 = js2jeon(code1)
    console.log('JEON representation:')
    console.log(JSON.stringify(jeon1, null, 2))

    // Convert JEON back to JavaScript without closure mode
    console.log('\nConverting JEON to JavaScript without closure mode:')
    const jsWithClosure = jeon2js(jeon1)
    console.log(jsWithClosure)

    // Apply IIFE conversion
    console.log('\nApplying IIFE conversion:')
    iifeCode1 = convertToIIFE(jsWithClosure)
    console.log(iifeCode1)
} catch (error: any) {
    console.log('Error in conversion pipeline:', error.message)
    iifeCode1 = convertToIIFE(code1)
}
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

// Test 2: Function call only
const code2 = `a('world');`

console.log('\n\n=== Test 2: Function call only ===')
console.log('Original code:')
console.log(code2)

let iifeCode2: string

// Convert JavaScript to JEON
console.log('\nConverting JavaScript to JEON:')
try {
    const jeon2 = js2jeon(code2)
    console.log('JEON representation:')
    console.log(JSON.stringify(jeon2, null, 2))

    // Convert JEON back to JavaScript without closure mode
    console.log('\nConverting JEON to JavaScript without closure mode:')
    const jsWithClosure = jeon2js(jeon2)
    console.log(jsWithClosure)

    // Apply IIFE conversion
    console.log('\nApplying IIFE conversion:')
    iifeCode2 = convertToIIFE(jsWithClosure)
    console.log(iifeCode2)
} catch (error: any) {
    console.log('Error in conversion pipeline:', error.message)
    iifeCode2 = convertToIIFE(code2)
}
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

// Test 3: Multiple statements
const code3 = `const x = 5;
const y = 10;
x + y;`

console.log('\n\n=== Test 3: Multiple statements ===')
console.log('Original code:')
console.log(code3)

let iifeCode3: string

// Convert JavaScript to JEON
console.log('\nConverting JavaScript to JEON:')
try {
    const jeon3 = js2jeon(code3)
    console.log('JEON representation:')
    console.log(JSON.stringify(jeon3, null, 2))

    // Convert JEON back to JavaScript without closure mode
    console.log('\nConverting JEON to JavaScript without closure mode:')
    const jsWithClosure = jeon2js(jeon3)
    console.log(jsWithClosure)

    // Apply IIFE conversion
    console.log('\nApplying IIFE conversion:')
    iifeCode3 = convertToIIFE(jsWithClosure)
    console.log(iifeCode3)
} catch (error: any) {
    console.log('Error in conversion pipeline:', error.message)
    iifeCode3 = convertToIIFE(code3)
}
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