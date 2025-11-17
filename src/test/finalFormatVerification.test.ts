import { js2jeon } from '../js2jeon'

console.log('=== Final Format Verification ===')

// Test the exact case you mentioned
const code = `// First comment

const a = 1;`

const jeon = js2jeon(code)
console.log('JEON output:')
console.log(JSON.stringify(jeon, null, 2))

// Verify the structure
if (Array.isArray(jeon) && jeon.length > 0) {
    const firstStatement = jeon[0]
    if (firstStatement['//'] && firstStatement['//'][0] === ' First comment' &&
        firstStatement['@@'] && firstStatement['@@'].a === 1) {
        console.log('✅ Format is correct!')
    } else {
        console.log('❌ Format is incorrect')
        console.log('Expected: { "//": [" First comment" ], "@@": { "a": 1 } }')
        console.log('Got:', JSON.stringify(firstStatement, null, 2))
    }
} else if (jeon['//'] && jeon['//'][0] === ' First comment' &&
    jeon['@@'] && jeon['@@'].a === 1) {
    console.log('✅ Format is correct!')
} else {
    console.log('❌ Format is incorrect')
    console.log('Expected: { "//": [" First comment" ], "@@": { "a": 1 } }')
    console.log('Got:', JSON.stringify(jeon, null, 2))
}