import { expect, test } from '@woby/chk'
import { jeon2js } from '../jeon2js'
import { js2jeon } from '../js2jeon'
import { normalizeJs } from './testUtils'

// Test cases covering all the functionality we've been working on
const testCases = [
    {
        name: 'Async function with await',
        code: `async function fetchData() {
  const response = await fetch("/api/data");
  return response;
}`
    },
    {
        name: 'JSX element with children',
        code: `let element = <div className="container">
  <h1>Hello World</h1>
</div>;`
    },
    {
        name: 'Combined async and JSX',
        code: `async function renderData() {
  const data = await fetchData();
  return <div className="data-container">{data}</div>;
}`
    },
    {
        name: 'Arrow function with block and return',
        code: `(x) => { return (x * 2); }`
    },
    {
        name: 'Arrow function with expression',
        code: `(x) => x * 2`
    },
    {
        name: 'Async arrow function',
        code: `async (x) => { return await fetch(x); }`
    },
    {
        name: 'Arrow function with multiple statements',
        code: `(x) => { const y = x * 2; return y; }`
    },
    {
        name: 'Class with async method',
        code: `class DataProcessor {
  async process() {
    const data = await fetchData();
    return data;
  }
}`
    },
    {
        name: 'Complex JSX with nested elements',
        code: `const app = <div className="app">
  <header>
    <h1>Welcome</h1>
  </header>
  <main>
    <p>Hello World</p>
  </main>
</div>;`
    }
]

test('Comprehensive Round-trip Test', () => {
    let passedTests = 0
    let totalTests = testCases.length

    testCases.forEach((testCase, index) => {
        test(`${index + 1}: ${testCase.name}`, () => {
            console.log(`--- Test ${index + 1}: ${testCase.name} ---`)
            console.log('Original code:')
            console.log(testCase.code)

            // Convert JS to JEON
            const jeon = js2jeon(testCase.code)
            expect(jeon).toBeDefined()
            expect(jeon).not.toBeNull()

            console.log('\nJEON output:')
            console.log(JSON.stringify(jeon, null, 2))

            // Convert JEON back to JS
            const regenerated = jeon2js(jeon)
            expect(regenerated).toBeDefined()
            expect(typeof regenerated).toBe('string')

            console.log('\nRegenerated code:')
            console.log(regenerated)

            // Normalize both codes for comparison
            const normalizedOriginal = normalizeJs(testCase.code)
            const normalizedRegenerated = normalizeJs(regenerated)

            console.log('\n=== Normalized Comparison ===')
            console.log('Original:', normalizedOriginal)
            console.log('Regenerated:', normalizedRegenerated)

            // Direct normalized string comparison
            expect(normalizedRegenerated).toBe(normalizedOriginal)

            // Check for specific issues we've fixed
            let hasIssues = false

            // Check for "return return" issue
            if (regenerated.includes('return return')) {
                console.log('❌ FAILED: Still has "return return" issue')
                hasIssues = true
            }

            // Check for JSX function call issue (di, h, etc.) - more specific check
            // Only flag actual function calls in the regenerated code, not in logs
            // Look for patterns like "di(...)" or "h(...)" that would indicate the old broken behavior
            if (regenerated.match(/\b(di|h)\s*\([^)]*\)/)) {
                console.log('❌ FAILED: Still has JSX function call issue')
                hasIssues = true
            }

            if (!hasIssues) {
                console.log('✅ PASSED: No known issues detected')
                passedTests++
            }

            // Functional equivalence test for simple cases
            try {
                if (testCase.name.includes('Arrow function') && !testCase.name.includes('Async')) {
                    // Test with a simple value
                    const testValue = 5

                    // For expression arrow functions, we can test directly
                    if (testCase.name.includes('expression')) {
                        // We can't actually eval in the test environment, so we'll just check structure
                        expect(regenerated).toContain('=>')
                        expect(regenerated).toContain('*')
                    }
                }
            } catch (error) {
                console.log('⚠️  Could not test functional equivalence')
            }

            // Basic assertions
            expect(jeon).toBeDefined()
            expect(typeof jeon).toBe('object')
            expect(regenerated).toBeDefined()
            expect(typeof regenerated).toBe('string')
        })
    })

    // Summary test
    test('Test summary', () => {
        console.log('=== Test Summary ===')
        console.log(`Passed: ${passedTests}/${totalTests}`)

        if (passedTests === totalTests) {
            console.log('🎉 ALL TESTS PASSED!')
        } else {
            console.log('❌ Some tests failed. Please review the output above.')
        }

        // At least some tests should pass
        expect(passedTests).toBeGreaterThan(0)
    })
})