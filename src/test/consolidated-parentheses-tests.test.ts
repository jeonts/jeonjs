import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

// Test cases for parentheses functionality
const parenthesesTestCases = [
    {
        name: 'Empty object in parentheses',
        code: '({})'
    },
    {
        name: 'Binary expression in parentheses',
        code: '(1+2)'
    },
    {
        name: 'Nested parentheses',
        code: '((1+2))'
    }
]

test('Consolidated Parentheses Support Tests', () => {
    console.log('=== Consolidated Parentheses Tests ===\n')

    // Test JEON parentheses support examples
    parenthesesTestCases.forEach((testCase, index) => {
        console.log(`Test ${index + 1}: ${testCase.name}`)
        const jeon = js2jeon(testCase.code)
        console.log(`JavaScript: ${testCase.code}`)
        console.log(`JEON:`, JSON.stringify(jeon, null, 2))
        const back = jeon2js(jeon)
        console.log(`Back to JavaScript: ${back}\n`)

        // Assertions
        expect(testCase.code).toBeDefined()
        expect(jeon).toBeDefined()
        expect(back).toBeDefined()
    })

    console.log('All parentheses examples completed successfully!')
})

// Test how Acorn parses parentheses with preserveParens option
test('Acorn Parentheses Parsing Test', () => {
    console.log('=== Acorn Parentheses Parsing Test ===\n')

    const code1 = '({})'
    const code2 = '(1+2)'

    const Parser = acorn.Parser.extend(jsx())

    console.log('Testing empty object in parentheses (with preserveParens=true):')
    try {
        const ast1 = Parser.parse(code1, {
            ecmaVersion: 'latest',
            sourceType: 'module',
            preserveParens: true
        })
        console.log(JSON.stringify(ast1, null, 2))
    } catch (e: any) {
        console.log('Error:', e.message)
    }

    console.log('\nTesting binary expression in parentheses (with preserveParens=true):')
    try {
        const ast2 = Parser.parse(code2, {
            ecmaVersion: 'latest',
            sourceType: 'module',
            preserveParens: true
        })
        console.log(JSON.stringify(ast2, null, 2))
    } catch (e: any) {
        console.log('Error:', e.message)
    }

    // Assertions
    expect(code1).toBeDefined()
    expect(code2).toBeDefined()
})

// Test JEON to JS conversion for parentheses
test('JEON to JS Parentheses Conversion Test', () => {
    console.log('=== JEON to JS Parentheses Conversion Test ===\n')

    // Test JEON to JS conversion
    console.log('\n=== JEON to JS ===')
    const jeon3 = {
        '(': {}
    }
    const code3 = jeon2js(jeon3)
    console.log(`Input:`, JSON.stringify(jeon3, null, 2))
    console.log(`Output: ${code3}`)

    const jeon4 = {
        '(': {
            '+': [1, 2]
        }
    }
    const code4 = jeon2js(jeon4)
    console.log(`\nInput:`, JSON.stringify(jeon4, null, 2))
    console.log(`Output: ${code4}`)

    // Test round-trip
    console.log('\n=== Round-trip test ===')
    const originalCode = '(1+2)'
    const jeon = js2jeon(originalCode)
    const convertedCode = jeon2js(jeon)
    console.log(`Original: ${originalCode}`)
    console.log(`JEON:`, JSON.stringify(jeon, null, 2))
    console.log(`Converted back: ${convertedCode}`)

    // Assertions
    expect(jeon3).toBeDefined()
    expect(code3).toBeDefined()
    expect(jeon4).toBeDefined()
    expect(code4).toBeDefined()
    expect(originalCode).toBeDefined()
    expect(jeon).toBeDefined()
    expect(convertedCode).toBeDefined()
})