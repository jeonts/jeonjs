// Test function name extraction
console.log('=== Testing Function Name Extraction ===\n')

const testKeys = [
    'function a(name)',
    'function sum(a, b)',
    'function(name)',
    'function ()',
    'function getData()'
]

for (const key of testKeys) {
    console.log(`Testing key: "${key}"`)
    const nameMatch = key.match(/function\s+(\w+)/)
    if (nameMatch) {
        console.log(`  Matched: "${nameMatch[1]}"`)
    } else {
        console.log(`  No match`)
    }

    // Try alternative regex
    const altMatch = key.match(/function\s*(\w*)\s*\(/)
    if (altMatch) {
        console.log(`  Alternative match: "${altMatch[1]}"`)
    } else {
        console.log(`  No alternative match`)
    }
    console.log('')
}

console.log('=== Test Completed ===')