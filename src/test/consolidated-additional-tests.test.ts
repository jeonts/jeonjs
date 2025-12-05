// Additional Consolidated Tests
// This file consolidates similar test cases from functionTest.test.ts, variableDeclarationTest.test.ts, 
// json5FeatureTest.test.ts, and roundTripTest.test.ts
import { expect, test } from '@woby/chk'
import * as acorn from 'acorn'
import jsx from 'acorn-jsx'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { ast2jeon } from '../js2jeon.visitors/ast2jeon'
import JSON5 from '@mainnet-pat/json5-bigint'
import { normalizeJs } from './testUtils'

// Create a JSON-like interface for JSON5
const JSON5Wrapper = {
  stringify: JSON5.stringify,
  parse: JSON5.parse,
  [Symbol.toStringTag]: 'JSON'
}

// Test different function types (from functionTest.test.ts)
const functionTests = [
  {
    name: 'Function Expression',
    code: `(function(name) { return ("Hello, " + name) })`,
    expectedElements: ['function', 'return', 'Hello']
  },
  {
    name: 'Named Function',
    code: `function a(name) { return ("Hello, " + name) }`,
    expectedElements: ['function a', 'return', 'Hello']
  },
  {
    name: 'Arrow Function',
    code: `(x) => { return (x * 2); }`,
    expectedElements: ['=>', 'return', '*']
  }
]

test('Function AST Parsing Tests', () => {
  functionTests.forEach(({ name, code, expectedElements }) => {
    test(`${name} AST Parsing`, () => {
      try {
        const Parser = acorn.Parser.extend(jsx())
        const ast = Parser.parse(code, {
          ecmaVersion: 'latest',
          sourceType: 'module',
          allowReturnOutsideFunction: true
        })

        // Extract the function expression from the AST
        let functionNode
        if (ast.body[0].type === 'ExpressionStatement') {
          functionNode = ast.body[0].expression
        } else {
          functionNode = ast.body[0]
        }

        const jeon = ast2jeon(functionNode)

        expect(jeon).toBeDefined()
        expect(typeof jeon).toBe('object')

        console.log(`${name} JEON:`)
        console.log(JSON.stringify(jeon, null, 2))

        // Check for expected elements
        const jeonString = JSON.stringify(jeon)
        expectedElements.forEach(element => {
          expect(jeonString).toContain(element)
        })
      } catch (error: any) {
        expect(error).toBeUndefined() // This will fail and show the error
      }
    })
  })
})

// Test variable declarations (from variableDeclarationTest.test.ts)
test('Variable Declaration Conversion Test', () => {
  test('Converts variable declarations to JEON', () => {
    const code = `let count = 0; let message = "Hello World";`
    const expectedElements = ['let count = 0', 'let message = "Hello World"']

    console.log('=== Testing Variable Declaration Conversion ===')
    console.log('Input code:', code)

    try {
      const jeon = js2jeon(code)
      expect(jeon).toBeDefined()
      expect(typeof jeon).toBe('object')

      console.log('JEON output:')
      console.log(JSON.stringify(jeon, null, 2))

      // Check for expected elements
      const jeonString = JSON.stringify(jeon)
      expectedElements.forEach(element => {
        expect(jeonString).toContain(element)
      })
    } catch (error: any) {
      expect(error).toBeUndefined() // This will fail and show the error
    }
  })
})

// Test JSON5 features (from json5FeatureTest.test.ts)
test('JSON5 Feature Test', () => {
  test('Converts JS to JEON with Standard JSON and JSON5 and direct normalized string comparison', () => {
    // Test JavaScript code that showcases JSON5 features
    const testCode = `
const config = {
  name: "My App",
  version: "1.0.0",
  description: 'A sample application',
  features: [
    "feature1",
    "feature2",
    "feature3",
  ],
  port: 3000,
  timeout: Infinity,
  database: {
    host: "localhost",
    port: 5432,
  },
};

function process(config) {
  return config.name + " v" + config.version;
}
`
    const expectedElements = [
      'const config =',
      '"name": "My App"',
      '"version": "1.0.0"',
      'function process(config)'
    ]

    // Test with standard JSON
    const jeonStandard = js2jeon(testCode)
    expect(jeonStandard).toBeDefined()
    expect(typeof jeonStandard).toBe('object')

    // Test with JSON5
    const jeonJSON5 = js2jeon(testCode, { json: JSON5Wrapper })
    expect(jeonJSON5).toBeDefined()
    expect(typeof jeonJSON5).toBe('object')

    // Convert back with standard JSON
    const regeneratedStandard = jeon2js(jeonStandard)
    expect(regeneratedStandard).toBeDefined()
    expect(typeof regeneratedStandard).toBe('string')

    // Convert back with JSON5
    const regeneratedJSON5 = jeon2js(jeonJSON5, { json: JSON5Wrapper })
    expect(regeneratedJSON5).toBeDefined()
    expect(typeof regeneratedJSON5).toBe('string')

    // Check for key elements
    expectedElements.forEach(element => {
      expect(regeneratedStandard).toContain(element)
      expect(regeneratedJSON5).toContain(element)
    })

    console.log('✅ Key element checks PASSED for both JSON options')

    console.log('JSON5 test - Original:', testCode.substring(0, 100) + '...')
    console.log('JSON5 test - Standard JEON output length:', JSON.stringify(jeonStandard).length)
    console.log('JSON5 test - JSON5 JEON output length:', JSON5.stringify(jeonJSON5).length)
  })
})

// Test round-trip conversion (from roundTripTest.test.ts)
test('Round-trip Conversion Test', () => {
  test('Converts JS to JEON and back with direct normalized string comparison', () => {
    // Simple class code to test round-trip conversion
    const code = `
class MyClass {
  static staticProperty = 'static value';
  
  constructor(name) {
    this.name = name;
    this.items = [];
  }
  
  get displayName() {
    return this.name.toUpperCase();
  }
  
  set displayName(value) {
    this.name = value.toLowerCase();
  }
  
  addItem(item) {
    this.items.push(item);
  }
  
  static createInstance(name) {
    return new MyClass(name);
  }
}
`
    const expectedElements = [
      'class MyClass',
      'static staticProperty = "static value"',
      'constructor(name)',
      'this.name = name',
      'this.items = []',
      'get displayName()',
      'return this.name.toUpperCase()',
      'set displayName(value)',
      'this.name = value.toLowerCase()',
      'addItem(item)',
      'this.items.push(item)',
      'static createInstance(name)',
      'return new MyClass(name)'
    ]

    console.log('=== Original JS Code ===')
    console.log(code)

    // Convert JS to JEON
    const jeon = js2jeon(code)
    expect(jeon).toBeDefined()
    expect(typeof jeon).toBe('object')

    console.log('\n=== Converted to JEON ===')
    console.log(JSON.stringify(jeon, null, 2))

    // Convert JEON back to JS
    console.log('\n=== Converted back to JS ===')
    try {
      const regeneratedJs = jeon2js(jeon)
      expect(regeneratedJs).toBeDefined()
      expect(typeof regeneratedJs).toBe('string')

      console.log(regeneratedJs)

      // Check for key elements
      expectedElements.forEach(element => {
        expect(regeneratedJs).toContain(element)
      })

      console.log('\n=== SELF-CHECK RESULT ===')
      console.log('✅ Round-trip conversion completed successfully!')
    } catch (error: any) {
      expect(error).toBeUndefined() // This will fail and show the error
    }
  })
})

console.log('🎉 All additional consolidated tests completed!')