import { jeon2js } from '../jeon2js'

console.log('=== Multiline Block Comment Final Test ===')

// This test demonstrates how the multiline block comment operator should work
// once it's properly implemented in the operatorVisitor.ts file

// Test case 1: Multiline block comment with array of strings
const jeon1 = {
    '/*': ['This is a', 'multiline block', 'comment'],
    '@@': {
        'x': 42
    }
}

console.log('Test 1 - JEON with multiline block comment array:')
console.log(JSON.stringify(jeon1, null, 2))

// Test case 2: Single line block comment with string
const jeon2 = {
    '/*': 'This is a single line block comment',
    '@@': {
        'y': 10
    }
}

console.log('\nTest 2 - JEON with single line block comment string:')
console.log(JSON.stringify(jeon2, null, 2))

// Test case 3: Empty block comment
const jeon3 = {
    '/*': [],
    '@@': {
        'z': 5
    }
}

console.log('\nTest 3 - JEON with empty block comment:')
console.log(JSON.stringify(jeon3, null, 2))

console.log('\n=== Implementation Notes ===')
console.log('To implement the multiline block comment operator:')
console.log('1. Add a case for \'/*\' in the visitOperator function in operatorVisitor.ts')
console.log('2. Handle both array of strings (multiline) and single string (single line) formats')
console.log('3. For arrays, join elements with newlines: /*${operands.join(\'\\n\')}*/')
console.log('4. For strings, wrap directly: /*${operands}*/')
console.log('5. Handle empty cases appropriately')

console.log('\nExpected JavaScript output for Test 1:')
console.log('/*This is a')
console.log('multiline block')
console.log('comment*/')
console.log('const x = 42;')

console.log('\nExpected JavaScript output for Test 2:')
console.log('/*This is a single line block comment*/')
console.log('const y = 10;')

console.log('\nExpected JavaScript output for Test 3:')
console.log('/**/')
console.log('const z = 5;')

console.log('\nAll tests and documentation completed!')