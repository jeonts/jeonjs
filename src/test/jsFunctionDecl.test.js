// Test JavaScript function declarations vs expressions

console.log('=== Testing JavaScript Function Declarations vs Expressions ===\n')

// Test case 1: Function declaration (hoisted)
try {
    const result1 = (function a(name) {
        return 'Hello, ' + name;
    }, a('world'))
    console.log('Test 1 (function expression) result:', result1)
} catch (error) {
    console.log('Test 1 (function expression) error:', error.message)
}

// Test case 2: Function declaration (proper way)
try {
    // This won't work in a sequence, but let's see
    function b(name) {
        return 'Hello, ' + name;
    }
    const result2 = b('world')
    console.log('Test 2 (function declaration) result:', result2)
} catch (error) {
    console.log('Test 2 (function declaration) error:', error.message)
}

// Test case 3: IIFE pattern that the user might want
try {
    const result3 = (function () {
        function a(name) {
            return 'Hello, ' + name;
        }
        return a('world')
    })()
    console.log('Test 3 (IIFE with function declaration) result:', result3)
} catch (error) {
    console.log('Test 3 (IIFE with function declaration) error:', error.message)
}

console.log('\n=== Test Completed ===')