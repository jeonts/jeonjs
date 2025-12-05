import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Comprehensive evalJeon Test ===\n')

// Test various JavaScript constructs that js2jeon can produce
const testCases = [
    {
        name: 'Simple expression',
        code: '1 + 2'
    },
    {
        name: 'Variable assignment with let',
        code: 'let x = 42; x'
    },
    {
        name: 'Variable assignment with const',
        code: 'const y = 100; y'
    },
    {
        name: 'Function declaration and call',
        code: 'function add(a, b) { return a + b; } add(1, 2)'
    },
    {
        name: 'Arrow function',
        code: 'const multiply = (a, b) => a * b; multiply(3, 4)'
    },
    {
        name: 'Class declaration with constructor and method',
        code: `class Person {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return "Hello, " + this.name;
  }
}
const p = new Person("Alice");
p.greet();`
    },
    {
        name: 'Array literal',
        code: '[1, 2, 3]'
    },
    {
        name: 'Object literal',
        code: '({ a: 1, b: 2 })'
    },
    {
        name: 'If statement',
        code: 'if (true) { 42; } else { 0; }'
    },
    {
        name: 'While loop',
        code: 'let i = 0; while (i < 3) { i++; } i'
    },
    {
        name: 'For loop',
        code: 'let sum = 0; for (let i = 0; i < 3; i++) { sum += i; } sum'
    },
    {
        name: 'Complex expression with multiple statements',
        code: `
      const calculate = (a, b) => {
        const sum = a + b;
        const product = a * b;
        return { sum, product };
      };
      calculate(3, 4);
    `
    }
]

try {
    testCases.forEach((testCase, index) => {
        console.log(`\n--- Test Case ${index + 1}: ${testCase.name} ---`)
        console.log('JavaScript code:')
        console.log(testCase.code)

        try {
            // Convert to JEON
            console.log('\nConverting to JEON...')
            const jeon = js2jeon(testCase.code)
            console.log('JEON representation:')
            console.log(JSON.stringify(jeon, null, 2))

            // Try to evaluate with current evalJeon
            console.log('\nAttempting to evaluate with evalJeon...')
            const result = evalJeon(jeon)
            console.log('Evaluation result:', result)
            console.log('Type of result:', typeof result)

            console.log('✅ Success')
        } catch (error: any) {
            console.error('❌ Error during evaluation:', error.message)
            console.error('Stack:', error.stack)
        }
    })

    console.log('\n=== Test completed ===')

} catch (error: any) {
    console.error('❌ Unexpected error:', error.message)
    console.error('Stack:', error.stack)
}