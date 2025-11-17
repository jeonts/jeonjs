import { jeon2js } from '../jeon2js'

console.log('=== Existing Comment Functionality Test ===')

// Test that existing single-line comment functionality still works
const jeon1 = {
    '//': 'This is a single-line comment',
    '@@': {
        'x': 42
    }
}

console.log('Test 1 - JEON with single-line comment:')
console.log(JSON.stringify(jeon1, null, 2))

const js1 = jeon2js(jeon1)
console.log('Generated JavaScript:', js1)

// Test with just a comment (no variable declaration)
const jeon2 = {
    '//': 'This is a standalone comment'
}

console.log('\nTest 2 - JEON with standalone comment:')
console.log(JSON.stringify(jeon2, null, 2))

const js2 = jeon2js(jeon2)
console.log('Generated JavaScript:', js2)

console.log('\nAll existing functionality tests completed!')