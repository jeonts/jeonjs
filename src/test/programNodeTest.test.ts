import { js2jeon } from '../js2jeon'

console.log('=== Program Node Test ===\n')

// Test 1: Single statement without comments (no program node)
console.log('Test 1: Single statement without comments')
const result1 = js2jeon('const x = 1;')
console.log(JSON.stringify(result1, null, 2))

// Test 2: Multiple statements without trailing comments (array output)
console.log('\nTest 2: Multiple statements without trailing comments')
const result2 = js2jeon('const x = 1;\nconst y = 2;')
console.log(JSON.stringify(result2, null, 2))

// Test 3: Multiple statements with trailing comments (program node)
console.log('\nTest 3: Multiple statements with trailing comments')
const result3 = js2jeon('const x = 1;\nconst y = 2;\n/* trailing comment */')
console.log(JSON.stringify(result3, null, 2))

// Test 4: Single statement with trailing comments (no program node, but with comment)
console.log('\nTest 4: Single statement with trailing comments')
const result4 = js2jeon('const x = 1;\n/* trailing comment */')
console.log(JSON.stringify(result4, null, 2))