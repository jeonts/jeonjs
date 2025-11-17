import { visitOperator } from '../jeon2js.visitors/operatorVisitor'

// Mock visit function for testing
const mockVisit = (item: any) => {
    if (typeof item === 'string') {
        return item
    }
    return JSON.stringify(item)
}

// Test cases using the imported visitOperator function
console.log('Testing multiline block comment operator with imported function:')

// Test 1: Array format (multiline)
const multilineComment = ['line1', 'line2', 'line3']
const result1 = visitOperator('/*', multilineComment, mockVisit)
console.log('Multiline comment result:', result1)

// Test 2: String format (single line)
const singleLineComment = 'This is a single line comment'
const result2 = visitOperator('/*', singleLineComment, mockVisit)
console.log('Single line comment result:', result2)

// Test 3: Regex operator (to ensure we didn't break existing functionality)
const regexOperands = { pattern: 'test', flags: 'gi' }
const result3 = visitOperator('/ /', regexOperands, mockVisit)
console.log('Regex operator result:', result3)

// Test 4: Comment operator (to ensure we didn't break existing functionality)
const commentOperands = 'This is a regular comment'
const result4 = visitOperator('//', commentOperands, mockVisit)
console.log('Comment operator result:', result4)