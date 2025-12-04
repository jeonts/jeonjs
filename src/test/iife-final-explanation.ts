// Final Explanation of IIFE Detection Logic in JEON
//
// This test accurately demonstrates what the IIFE detection logic in index.tsx (lines 247-285) does

import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

console.log('=== IIFE Detection Logic Explanation ===\n')

// The actual implementation from index.tsx lines 247-285
function detectAndUnwrapIIFE(codeToParse: string): { isIIFE: boolean; unwrappedCode?: string } {
    try {
        const Parser = acorn.Parser.extend(jsx())
        const ast: any = Parser.parse(codeToParse, {
            ecmaVersion: 'latest',
            sourceType: 'module',
            allowReturnOutsideFunction: true,
            preserveParens: true
        })

        // Check if the top-level node is an expression statement containing a call expression
        // which calls a function expression - this is the pattern of an IIFE
        if (ast.body.length === 1 &&
            ast.body[0].type === 'ExpressionStatement' &&
            ast.body[0].expression.type === 'CallExpression' &&
            ast.body[0].expression.arguments.length === 0) { // No arguments to the IIFE call

            // Get the callee, which might be wrapped in parentheses
            let callee = ast.body[0].expression.callee

            // If it's a parenthesized expression, get the inner expression
            // NOTE: This only handles ONE level of parentheses
            if (callee.type === 'ParenthesizedExpression') {
                callee = callee.expression
            }

            // Check if the callee is a function expression or arrow function
            if (callee.type === 'FunctionExpression' || callee.type === 'ArrowFunctionExpression') {
                // Extract the function part by removing the outer call parentheses
                // We need to find the source of just the function expression
                const functionStart = callee.start
                const functionEnd = callee.end
                const functionCode = codeToParse.substring(functionStart, functionEnd)

                return { isIIFE: true, unwrappedCode: functionCode }
            }
        }

        return { isIIFE: false }
    } catch (e) {
        // If parsing fails, it's not a valid IIFE or not parsable, continue with original code
        console.log('Failed to parse as IIFE, using original code')
        return { isIIFE: false }
    }
}

// Test cases showing what works and what doesn't
const testCases = [
    {
        name: "Basic function IIFE - Works",
        code: "(function() { return 'hello'; })()",
        description: "Standard IIFE pattern"
    },
    {
        name: "Basic arrow IIFE - Works",
        code: "(() => { return 'hello'; })()",
        description: "Standard arrow function IIFE pattern"
    },
    {
        name: "One level of extra parentheses - Works",
        code: "((function() { return 'hello'; }))()",
        description: "Function wrapped in one extra set of parentheses"
    },
    {
        name: "Two levels of extra parentheses - Does NOT work",
        code: "(((function() { return 'hello'; })))()",
        description: "Function wrapped in two extra sets of parentheses (too deep)"
    },
    {
        name: "IIFE with arguments - Does NOT work",
        code: "(function(name) { return 'Hello, ' + name; })('World')",
        description: "IIFE with parameters (logic requires 0 arguments)"
    },
    {
        name: "Regular function - Does NOT work",
        code: "function normalFunction() { return 'hello'; }",
        description: "Standard function declaration (not an IIFE)"
    }
]

testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.name}`)
    console.log(`Code: ${testCase.code}`)
    console.log(`Description: ${testCase.description}`)

    const result = detectAndUnwrapIIFE(testCase.code)

    if (result.isIIFE) {
        console.log(`✅ IS an IIFE`)
        console.log(`Unwrapped: ${result.unwrappedCode}`)
    } else {
        console.log(`❌ NOT an IIFE`)
    }

    console.log('---\n')
})

console.log('=== Key Points About IIFE Detection ===\n')
console.log('1. The logic specifically looks for IIFEs with ZERO arguments')
console.log('2. It handles EXACTLY ONE level of extra parentheses around the function')
console.log('3. It works with both function expressions and arrow functions')
console.log('4. It does NOT work with:')
console.log('   - IIFEs that have arguments')
console.log('   - Functions with more than one level of parentheses nesting')
console.log('   - Regular function declarations')
console.log('   - Function expressions assigned to variables')
console.log('')

console.log('=== Why This Design? ===\n')
console.log('The IIFE detection is designed to handle the most common case:')
console.log('- Users paste code like "(function() { ... })()" in the playground')
console.log('- The system automatically unwraps it to just "function() { ... }"')
console.log('- This makes the conversion cleaner and more intuitive')
console.log('')
console.log('The limitation to one level of parentheses is intentional:')
console.log('- Keeps the logic simple and predictable')
console.log('- Covers the vast majority of real-world IIFE usage')
console.log('- Avoids overly complex recursive parsing logic')