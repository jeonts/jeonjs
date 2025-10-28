import * as JSON5 from 'json5'

// Simple test to understand JSON5 API
console.log('=== JSON5 API Test ===')

// Test 1: Basic stringify
const obj = {
    "special-key": "value",
    "normalKey": "another value",
    "number": 42
}

console.log('Original object:', obj)

// Test JSON5 stringify
const json5String = JSON5.stringify(obj, null, 2)
console.log('JSON5 stringified:')
console.log(json5String)

// Test JSON5 parse
const parsedObj = JSON5.parse(json5String)
console.log('Parsed object:', parsedObj)

// Test 2: Check if methods exist
console.log('\n=== Method Existence Check ===')
console.log('JSON5.stringify exists:', typeof JSON5.stringify === 'function')
console.log('JSON5.parse exists:', typeof JSON5.parse === 'function')

// Test 3: Create a wrapper like we're doing in the web interface
console.log('\n=== Wrapper Test ===')
const JSON5Wrapper = {
    stringify: JSON5.stringify,
    parse: JSON5.parse,
    [Symbol.toStringTag]: 'JSON'
}

console.log('JSON5Wrapper.stringify exists:', typeof JSON5Wrapper.stringify === 'function')
console.log('JSON5Wrapper.parse exists:', typeof JSON5Wrapper.parse === 'function')

// Test using the wrapper
const wrappedString = JSON5Wrapper.stringify(obj, null, 2)
console.log('Wrapped stringified:')
console.log(wrappedString)

const wrappedParsed = JSON5Wrapper.parse(wrappedString)
console.log('Wrapped parsed:', wrappedParsed)