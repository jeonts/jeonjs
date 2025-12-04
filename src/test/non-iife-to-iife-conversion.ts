// Test script for converting non-IIFE code to IIFE with proper return handling
//
// This script demonstrates conversion of various code patterns to IIFE format
// with appropriate return statements based on the last line
//
// IIFE/REPL Specification:
// 1. Class expressions (both named and anonymous) are wrapped in parentheses to match REPL behavior:
//    - class {} -> return (class {})
//    - class A{} -> return A (the class name)
//
// 2. Function expressions are wrapped in parentheses to match REPL behavior:
//    - function (){} -> return (function (){})
//    - function A(){} -> return A (the function name)
//
// 3. Array and object literals that might cause parse errors are handled appropriately:
//    - Array literals [,,,] -> return [,,,] (no parentheses needed)
//    - Object literals {...} -> return ({...}) (wrapped in parentheses to distinguish from block statements)
//
// 4. Last line/statement behavior:
//    - Expressions: return the expression directly
//    - Variable declarations: return the last declared variable value
//    - Declarations without initializers: return void 0
//    - Explicit return statements: maintained as-is

import { convertToIIFE } from '../iifeConverter'

// Test cases with expected transformations
const testCases = [
    {
        name: "Simple expression statement",
        input: "const a = 1;\n\nconst b = 2;\n\na + b;",
        description: "Should return the value of the last expression"
    },
    {
        name: "Function declaration",
        input: "function sum() {}",
        description: "Should return the function directly"
    },
    {
        name: "Arrow function expression",
        input: "() => {}",
        description: "Should return the arrow function"
    },
    {
        name: "Object literal return",
        input: "const a = 1;\nconst b = 2;\n\nreturn {a, b};",
        description: "Should maintain the exact return statement"
    },
    {
        name: "Array literal return",
        input: "return [1, 3];",
        description: "Should maintain the exact return statement"
    },
    {
        name: "Variable declarations only",
        input: "const a = 1;\nlet b = 2;",
        description: "Should return the last declared variable value"
    },
    {
        name: "Variable declaration without initializer",
        input: "let a;",
        description: "Should return void 0"
    },
    {
        name: "Class declaration",
        input: "class MyClass {}",
        description: "Should return the class directly"
    },
    {
        name: "Anonymous class expression",
        input: "class {}",
        description: "Should wrap anonymous class expression and return it directly"
    },
    {
        name: "Function expression assignment",
        input: "const fn = function() {};",
        description: "Should wrap function expression and return the variable"
    },
    {
        name: "Anonymous arrow function",
        input: "() => {}",
        description: "Should wrap anonymous arrow function in IIFE and return it directly"
    },
    {
        name: "Anonymous function expression",
        input: "(function() {})",
        description: "Should wrap anonymous function expression and return it directly"
    },
    {
        name: "Already an IIFE",
        input: "(function() { return 42; })()",
        description: "Should remain unchanged as it's already an IIFE"
    },
    {
        name: "Already an IIFE with parameters",
        input: "(function(a, b) { return a + b; })(1, 2)",
        description: "Should remain unchanged as it's already an IIFE with parameters"
    },
    {
        name: "Already an arrow function IIFE",
        input: "(() => { return 42; })()",
        description: "Should remain unchanged as it's already an arrow function IIFE"
    },
    {
        name: "Mixed statements with expression at end",
        input: "const x = 5;\nfunction helper() {}\nx * 2;",
        description: "Should return the value of the last expression"
    },

    {
        name: "Empty code",
        input: "",
        description: "Should create an empty IIFE"
    }
]

console.log('=== Non-IIFE to IIFE Conversion Test ===\n')

testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.name}`)
    console.log(`Description: ${testCase.description}`)
    console.log('Input:')
    console.log(testCase.input)

    const result = convertToIIFE(testCase.input)
    console.log('Output:')
    console.log(result)

    console.log('---\n')
})

// Additional demonstration of specific transformations
console.log('=== Specific Transformation Examples ===\n')

const examples = [
    {
        name: "Expression statement conversion",
        before: "const a = 1;\n\nconst b = 2;\n\na + b;",
        after: "(() => {\n  const a = 1;\n  \n  const b = 2;\n  \n  return a + b;\n})()"
    },
    {
        name: "Function declaration conversion",
        before: "function sum() {}",
        after: "(() => {\n  function sum() {}\n  return sum;\n})()"
    },
    {
        name: "Class declaration conversion",
        before: "class MyClass {}",
        after: "(() => {\n  class MyClass {}\n  return MyClass;\n})()"
    },
    {
        name: "Arrow function conversion",
        before: "() => {}",
        after: "(() => {\n  return () => {};\n})()"
    },
    {
        name: "Explicit return maintenance",
        before: "return {a, b};",
        after: "(() => {\n  return {a, b};\n})()"
    },
    {
        name: "Anonymous arrow function conversion",
        before: "() => {}",
        after: "(() => {\n  return () => {};\n})()"
    },
    {
        name: "Function expression assignment",
        before: "const fn = function() {};",
        after: "(() => {\n  const fn = function() {};\n  return fn;\n})()"
    },
    {
        name: "Anonymous class expression",
        before: "class {}",
        after: "(() => {\n  return (class {});\n})()"
    },
    {
        name: "Anonymous function expression",
        before: "(function() {})",
        after: "(() => {\n  return (function() {});\n})()"
    },
    {
        name: "Array literal",
        before: "([])",
        after: "(() => {\n  return ([]);\n})()"
    },
    {
        name: "Object literal",
        before: "({})",
        after: "(() => {\n  return ({});\n})()"
    },
    {
        name: "Bare array literal",
        before: "[1,2]",
        after: "(() => {\n  return [1,2];\n})()"
    },
    {
        name: "Bare object literal",
        before: "{a,b}",
        after: "(() => {\n  return ({a,b});\n})()"
    },
    {
        name: "Bare anonymous class",
        before: "class {constructor(){}}",
        after: "(() => {\n  return (class {constructor(){}});\n})()"
    },
    {
        name: "Bare anonymous function",
        before: "function(a) { return a }",
        after: "(() => {\n  return (function(a) { return a });\n})()"
    }
]

examples.forEach((example, index) => {
    console.log(`Example ${index + 1}: ${example.name}`)
    console.log('Before:')
    console.log(example.before)
    console.log('After (expected):')
    console.log(example.after)
    console.log('Actual conversion:')
    console.log(convertToIIFE(example.before))
    console.log('---\n')
})

console.log('=== Edge Cases ===\n')

// Test cases that may cause parse errors or edge cases in the conversion
// Edge cases that test the error handling capability of the converter
// These are syntactically invalid JavaScript but the converter should handle them gracefully
const edgeCases = [
    "if (true) { console.log('test'); }",
    "for (let i = 0; i < 5; i++) { console.log(i); }",
    "try { throw new Error('test'); } catch (e) { console.log(e.message); }",
    "// Just a comment",
    "/* Multi-line\n   comment */",
    "const obj = { method() { return this.value; } }; obj.method();",
    "class {}",  // Parse error - anonymous class declaration not in expression position
    "function() {}",  // Parse error - anonymous function declaration not in expression position
    "[]",  // Parse error - array literal not in expression position
    "{}"   // Parse error - block statement, not object literal
]

edgeCases.forEach((code, index) => {
    console.log(`Edge Case ${index + 1}:`)
    console.log('Input:')
    console.log(code)
    console.log('Output:')
    console.log(convertToIIFE(code))
    console.log('---\n')
})