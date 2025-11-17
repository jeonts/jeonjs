import { visitOperator } from '../jeon2js.visitors/operatorVisitor'

// Mock visit function for testing
const mockVisit = (item: any) => {
    if (typeof item === 'string') {
        return item
    }
    return JSON.stringify(item)
}

console.log('=== Documentation Comment Test ===')

// Test 1: JSDoc-style multiline comment
const jsdocComment = [
    '*',
    ' * This is a documentation comment',
    ' * @param {string} name - The name parameter',
    ' * @returns {string} A greeting message',
    ' '
]

const result1 = visitOperator('/*', jsdocComment, mockVisit)
console.log('Test 1 - JSDoc-style comment:')
console.log(result1)

// Test 2: Simple documentation comment
const simpleDocComment = [
    '* This is a simple documentation comment',
    '* It describes the purpose of a function',
    '* @param x The input value'
]

const result2 = visitOperator('/*', simpleDocComment, mockVisit)
console.log('\nTest 2 - Simple documentation comment:')
console.log(result2)

// Test 3: Class documentation comment
const classDocComment = [
    '* Represents a user in the system',
    '* @class',
    '* @property {string} name - The user\'s name',
    '* @property {number} age - The user\'s age',
    '* @property {string} email - The user\'s email address'
]

const result3 = visitOperator('/*', classDocComment, mockVisit)
console.log('\nTest 3 - Class documentation comment:')
console.log(result3)

// Test 4: Function documentation comment
const functionDocComment = [
    '* Calculates the sum of two numbers',
    '* @param {number} a - The first number',
    '* @param {number} b - The second number',
    '* @returns {number} The sum of a and b',
    '* @example',
    '* // returns 5',
    '* add(2, 3);'
]

const result4 = visitOperator('/*', functionDocComment, mockVisit)
console.log('\nTest 4 - Function documentation comment:')
console.log(result4)

// Test 5: Single-line documentation comment
const singleLineDoc = '* This is a single-line documentation comment'
const result5 = visitOperator('/*', singleLineDoc, mockVisit)
console.log('\nTest 5 - Single-line documentation comment:')
console.log(result5)

// Test 6: Empty documentation comment
const emptyDoc: string[] = []
const result6 = visitOperator('/*', emptyDoc, mockVisit)
console.log('\nTest 6 - Empty documentation comment:')
console.log(result6)

console.log('\nAll documentation comment tests completed!')