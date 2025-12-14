// Test standard JavaScript spread operator behavior
console.log('=== JavaScript Spread Operator Behavior ===\n')

const result = [1, 2, ...[3, 4], 5];
console.log('JavaScript result:');
console.log(result);
console.log('Array contents:');
result.forEach((item, index) => {
    console.log(`  [${index}]: ${item} (type: ${typeof item})`);
});

console.log('\nType of result:', typeof result);
console.log('Is array:', Array.isArray(result));