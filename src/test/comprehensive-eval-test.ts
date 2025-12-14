import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'
import { readFileSync } from 'fs'
import { join } from 'path'

console.log('=== Comprehensive evalJeon(js2jeon()) Test ===\n')

// Read the test cases file
const testFilePath = join(__dirname, '_.ts')
const fileContent = readFileSync(testFilePath, 'utf-8')

// Extract cases using regex
function extractCase(caseName: string): string | null {
    const regex = new RegExp(`const ${caseName} = \`([^]*?)\``, 'm')
    const match = fileContent.match(regex)
    return match ? match[1].trim() : null
}

// Helper function to test a case
function testCase(caseName: string, code: string | null) {
    console.log(`--- Testing ${caseName} ---`)
    if (!code) {
        console.log('❌ No code found\n')
        return false
    }

    console.log('Code:')
    console.log(code)

    try {
        const jeon = js2jeon(code, { iife: true })
        console.log('JEON:')
        console.log(JSON.stringify(jeon, null, 2))

        const result = evalJeon(jeon)
        console.log('Result:')
        console.log(result)
        console.log('✅ Success\n')
        return true
    } catch (error: any) {
        console.error('❌ Error:', error.message)
        console.log('')
        return false
    }
}

// Track results
let passed = 0
let total = 0

// Test all cases
const caseNames = [
    'case1', 'case2', 'case3', 'case2_1', 'case4', 'case5', 'case6', 'case7', 'case8', 'case9',
    'case10', 'case11', 'case12', 'case13', 'case14', 'case15', 'case16', 'case17', 'case18', 'case19',
    'case20', 'case21', 'case22', 'case23', 'case24', 'case25', 'case26', 'case27', 'case28', 'case29',
    'case30', 'case31', 'case32', 'case33', 'case34', 'case35', 'case36'
]

// Run all tests
for (const caseName of caseNames) {
    total++
    const code = extractCase(caseName)
    if (code) {
        if (testCase(caseName, code)) {
            passed++
        }
    } else {
        console.log(`--- Skipping ${caseName} (no code) ---\n`)
    }
}

console.log(`=== Test Results: ${passed}/${total} passed ===`)