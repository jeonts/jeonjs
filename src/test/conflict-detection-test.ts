import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { evalJeon } from '../safeEval'

console.log('=== Conflict Detection Test ===\n')

// Helper function to check if JEON has correct arrow function format
function hasCorrectArrowFormat(jeon: any, expectedFormat: string): boolean {
    // Recursive function to search through the JEON structure
    function search(obj: any): boolean {
        if (typeof obj !== 'object' || obj === null) {
            return false
        }

        if (Array.isArray(obj)) {
            return obj.some(item => search(item))
        }

        // Check if any keys match the expected format
        const keys = Object.keys(obj)
        if (keys.some(key => key.includes(expectedFormat))) {
            return true
        }

        // Recursively search values
        return Object.values(obj).some(value => search(value))
    }

    return search(jeon)
}

// Test cases to check for conflicts between spec and implementation
const testCases = [
    {
        name: 'Simple arrow function no params',
        code: 'const fn = () => 42; fn()',
        expectedFormat: '() =>'
    },
    {
        name: 'Arrow function with params',
        code: 'const add = (a, b) => a + b; add(2, 3)',
        expectedFormat: '(a, b) =>'
    },
    {
        name: 'Arrow function with block body',
        code: 'const mult = (x, y) => { return x * y; }; mult(3, 4)',
        expectedFormat: '(x, y) =>'
    },
    {
        name: 'IIFE with arrow function',
        code: '(() => { const x = 10; return x * 2; })()',
        expectedFormat: '() =>'
    }
]

let hasConflicts = false

for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`)
    console.log(`Code: ${testCase.code}`)

    try {
        // Test 1: js2jeon -> jeon2js round trip
        console.log('\n1. Round-trip test (js2jeon -> jeon2js):')
        const jeon = js2jeon(testCase.code, { iife: true })
        console.log('JEON (truncated):', JSON.stringify(jeon).substring(0, 100) + '...')

        // Check if arrow function format is correct
        const hasCorrectFormat = hasCorrectArrowFormat(jeon, testCase.expectedFormat)

        if (hasCorrectFormat) {
            console.log('✅ Correct arrow function format')
        } else {
            console.log('❌ INCORRECT arrow function format - POSSIBLE CONFLICT')
            console.log('Expected format:', testCase.expectedFormat)
            hasConflicts = true
        }

        const js = jeon2js(jeon)
        console.log('JS (truncated):', js.substring(0, 100) + '...')

        // Test 2: evalJeon(js2jeon({iife:true}))
        console.log('\n2. evalJeon test:')
        const result = evalJeon(jeon)
        console.log('Result:', result)
        console.log('✅ evalJeon executed successfully\n')

    } catch (error: any) {
        console.log('❌ Error:', error.message)
        hasConflicts = true
    }

    console.log('-'.repeat(50))
}

if (hasConflicts) {
    console.log('\n🚨 CONFLICTS DETECTED BETWEEN SPEC AND IMPLEMENTATION')
    process.exit(1)
} else {
    console.log('\n✅ NO CONFLICTS FOUND - ALL TESTS PASSED')
    process.exit(0)
}