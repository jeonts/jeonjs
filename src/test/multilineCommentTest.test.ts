import { jeon2js } from '../jeon2js'

console.log('=== Multiline Block Comment Test ===')

// Test multiline block comment operator
const jeon = {
    '/*': ['This is a', 'multiline block', 'comment'],
    '@@': {
        'x': 42
    }
}

console.log('JEON with multiline block comment:', JSON.stringify(jeon, null, 2))

const js = jeon2js(jeon)
console.log('Generated JavaScript:', js)

// Test single line block comment
const jeon2 = {
    '/*': 'This is a single line block comment',
    '@@': {
        'y': 10
    }
}

console.log('\nJEON with single line block comment:', JSON.stringify(jeon2, null, 2))

const js2 = jeon2js(jeon2)
console.log('Generated JavaScript:', js2)

console.log('\nAll tests completed!')