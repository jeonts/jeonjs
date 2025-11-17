import { visitOperator } from '../jeon2js.visitors/operatorVisitor'

// Mock visit function for testing
const mockVisit = (item: any) => {
    if (typeof item === 'string') {
        return item
    }
    return JSON.stringify(item)
}

console.log('=== Multiline Block Comment Edge Cases Test ===')

// Test 1: Null operand
try {
    const result1 = visitOperator('/*', null, mockVisit)
    console.log('Test 1 - Null operand:')
    console.log(result1)
} catch (e: any) {
    console.log('Test 1 - Null operand caused an error:', e.message)
}

// Test 2: Undefined operand
try {
    const result2 = visitOperator('/*', undefined, mockVisit)
    console.log('\nTest 2 - Undefined operand:')
    console.log(result2)
} catch (e: any) {
    console.log('Test 2 - Undefined operand caused an error:', e.message)
}

// Test 3: Number operand
try {
    const result3 = visitOperator('/*', 42, mockVisit)
    console.log('\nTest 3 - Number operand:')
    console.log(result3)
} catch (e: any) {
    console.log('Test 3 - Number operand caused an error:', e.message)
}

// Test 4: Object operand
try {
    const result4 = visitOperator('/*', { key: 'value' }, mockVisit)
    console.log('\nTest 4 - Object operand:')
    console.log(result4)
} catch (e: any) {
    console.log('Test 4 - Object operand caused an error:', e.message)
}

// Test 5: Empty string
try {
    const result5 = visitOperator('/*', '', mockVisit)
    console.log('\nTest 5 - Empty string:')
    console.log(result5)
} catch (e: any) {
    console.log('Test 5 - Empty string caused an error:', e.message)
}

// Test 6: String with special characters
try {
    const result6 = visitOperator('/*', 'Comment with * and / characters', mockVisit)
    console.log('\nTest 6 - String with special characters:')
    console.log(result6)
} catch (e: any) {
    console.log('Test 6 - String with special characters caused an error:', e.message)
}

// Test 7: Array with mixed types
try {
    const result7 = visitOperator('/*', ['line1', 42, 'line3'], mockVisit)
    console.log('\nTest 7 - Array with mixed types:')
    console.log(result7)
} catch (e: any) {
    console.log('Test 7 - Array with mixed types caused an error:', e.message)
}

// Test 8: Array with empty strings
try {
    const result8 = visitOperator('/*', ['', 'line1', '', 'line2', ''], mockVisit)
    console.log('\nTest 8 - Array with empty strings:')
    console.log(result8)
} catch (e: any) {
    console.log('Test 8 - Array with empty strings caused an error:', e.message)
}

console.log('\n=== JEON Format Examples with Edge Cases ===')

// Example of JEON with edge cases
console.log('1. Empty multiline comment:')
console.log(`{
  "/*": [],
  "@@": {
    "x": 1
  }
}`)

console.log('\n2. Single-line block comment with special characters:')
console.log(`{
  "/*": "Comment with * and / characters",
  "@@": {
    "y": 2
  }
}`)

console.log('\nAll edge case tests completed!')