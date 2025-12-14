import { jeon2js } from '../jeon2js'
import { evalJeon } from '../safeEval'

console.log('=== Block Comment Test ===')

// Test 1: Single line block comment
const jeon1 = {
    '/*': 'This is a single line block comment',
    '@@': {
        'x': 42
    }
}

console.log('Test 1 - JEON with single line block comment:')
console.log(JSON.stringify(jeon1, null, 2))

const js1 = jeon2js(jeon1)
console.log('Generated JavaScript:', js1)

// Test 2: Multiline block comment
const jeon2 = {
    '/*': ['This is a', 'multiline block', 'comment'],
    '@@': {
        'y': 10
    }
}

console.log('\nTest 2 - JEON with multiline block comment:')
console.log(JSON.stringify(jeon2, null, 2))

const js2 = jeon2js(jeon2)
console.log('Generated JavaScript:', js2)

// Test 3: Standalone block comment
const jeon3 = {
    '/*': 'This is a standalone block comment'
}

console.log('\nTest 3 - JEON with standalone block comment:')
console.log(JSON.stringify(jeon3, null, 2))

const js3 = jeon2js(jeon3)
console.log('Generated JavaScript:', js3)

console.log('\nAll block comment tests completed!')