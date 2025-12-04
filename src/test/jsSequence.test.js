// Test actual JavaScript behavior for sequence expressions

console.log('=== Testing JavaScript SequenceExpression Behavior ===\n')

// Test case 1: Simple sequence
const result1 = (1, 2, 3)
console.log('Test 1: (1, 2, 3) =', result1)

// Test case 2: Function expression and call
const result2 = (function () { return "hello"; }, "world")
console.log('Test 2: (function() { return "hello"; }, "world") =', result2)

// Test case 3: Named function and call - this will throw an error in JS
try {
    // This won't work because 'a' is not in scope
    const result3 = (function a(name) {
        return 'Hello, ' + name;
    }, a('world'))
    console.log('Test 3 result:', result3)
} catch (error) {
    console.log('Test 3 error:', error.message)
}

// Test case 4: Proper way to do it in JS
const result4 = (function a(name) {
    return 'Hello, ' + name;
}, typeof a)  // Check what 'a' is in scope
console.log('Test 4: (function a(name) { return "Hello, " + name; }, typeof a) =', result4)

console.log('\n=== Test Completed ===')