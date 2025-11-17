import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { evalJeon } from '../safeEval'

// Simple test function to mimic the testing framework
function runTest(name: string, testFn: () => void) {
    try {
        testFn()
        console.log(`✅ ${name}`)
    } catch (error) {
        console.log(`❌ ${name}: ${error}`)
    }
}

console.log('=== Regex and Comment Operator Tests ===')

runTest('Convert JavaScript regex literal to JEON', () => {
    const code = '/abc/g'
    const jeon = js2jeon(code)

    if (JSON.stringify(jeon) !== JSON.stringify({
        '/ /': {
            pattern: 'abc',
            flags: 'g'
        }
    })) {
        throw new Error(`Expected regex JEON structure, got: ${JSON.stringify(jeon)}`)
    }
})

runTest('Convert JEON regex operator to JavaScript', () => {
    const jeon = {
        '/ /': {
            pattern: 'abc',
            flags: 'gi'
        }
    }

    const js = jeon2js(jeon)
    if (js !== '/abc/gi') {
        throw new Error(`Expected "/abc/gi", got: "${js}"`)
    }
})

runTest('Evaluate JEON regex operator', () => {
    const jeon = {
        '/ /': {
            pattern: 'abc',
            flags: 'g'
        }
    }

    const result = evalJeon(jeon)
    if (!(result instanceof RegExp)) {
        throw new Error(`Expected RegExp instance, got: ${typeof result}`)
    }
    if (result.toString() !== '/abc/g') {
        throw new Error(`Expected "/abc/g", got: "${result.toString()}"`)
    }
})

runTest('Convert JEON comment operator to JavaScript', () => {
    const jeon = {
        '//': 'This is a comment'
    }

    const js = jeon2js(jeon)
    if (js !== '// This is a comment') {
        throw new Error(`Expected "// This is a comment", got: "${js}"`)
    }
})

runTest('Round-trip test for regex', () => {
    // Create a JEON structure with regex
    const originalJeon = {
        '/ /': {
            pattern: 'test\\d+',
            flags: 'gi'
        }
    }

    // Convert to JavaScript
    const jsCode = jeon2js(originalJeon)
    if (jsCode !== '/test\\d+/gi') {
        throw new Error(`Expected "/test\\d+/gi", got: "${jsCode}"`)
    }
})

console.log('All tests completed!')