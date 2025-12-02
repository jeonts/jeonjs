import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import JSON5 from '@mainnet-pat/json5-bigint'

console.log('=== JSX Round-trip Test ===\n')

// Test the JSX round-trip with exact formatting
const jsCode = `let element = <div className="container">
  <h1>Hello World</h1>
</div>;`

console.log('Original JavaScript:')
console.log(JSON.stringify(jsCode))

// Convert JS to JEON
console.log('\n--- Converting JS to JEON ---')
try {
    const jeonResult = js2jeon(jsCode, { json: JSON5 as any })
    console.log('JEON Output:')
    console.log(JSON.stringify(jeonResult, null, 2))

    // Convert JEON back to JS
    console.log('\n--- Converting JEON back to JS ---')
    const jsResult = jeon2js(jeonResult, { json: JSON5 as any })
    console.log('Generated JavaScript:')
    console.log(JSON.stringify(jsResult))

    // Check if they're exactly the same
    console.log('\n--- Comparison ---')
    console.log('Are they exactly equal?', jsCode === jsResult)
    if (jsCode !== jsResult) {
        console.log('Differences:')
        console.log('Original length:', jsCode.length)
        console.log('Generated length:', jsResult.length)

        // Find the first difference
        for (let i = 0; i < Math.min(jsCode.length, jsResult.length); i++) {
            if (jsCode[i] !== jsResult[i]) {
                console.log(`First difference at position ${i}:`)
                console.log(`  Original: '${jsCode[i]}' (char code: ${jsCode.charCodeAt(i)})`)
                console.log(`  Generated: '${jsResult[i]}' (char code: ${jsResult.charCodeAt(i)})`)
                break
            }
        }
    }
} catch (error: any) {
    console.log('Error:', error.message)
    console.log('Stack:', error.stack)
}

console.log('\n' + '='.repeat(50) + '\n')

// Test with the exact JEON format provided by the user
console.log('Testing with user-provided JEON format:')
const userJeon = {
    "@": {
        "element": {
            "<div>": {
                "className": "container",
                "children": [
                    {
                        "<h1>": {
                            "children": ["Hello World"]
                        }
                    }
                ]
            }
        }
    }
}

console.log('User JEON Input:')
console.log(JSON.stringify(userJeon, null, 2))

console.log('\n--- Converting User JEON to JS ---')
try {
    const jsResult2 = jeon2js(userJeon, { json: JSON5 as any })
    console.log('Generated JavaScript:')
    console.log(JSON.stringify(jsResult2))

    // Now convert back to JEON to test round-trip
    console.log('\n--- Converting back to JEON ---')
    const jeonResult2 = js2jeon(jsResult2, { json: JSON5 as any })
    console.log('JEON Output:')
    console.log(JSON.stringify(jeonResult2, null, 2))

    // Check if they're exactly the same
    console.log('\n--- Comparison ---')
    console.log('Are JEON structures exactly equal?', JSON.stringify(userJeon) === JSON.stringify(jeonResult2))
} catch (error: any) {
    console.log('Error:', error.message)
    console.log('Stack:', error.stack)
}