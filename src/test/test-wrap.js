const { js2jeon } = require('./dist/jeon-converter.cjs.js');

console.log('Testing object literal without parentheses:');
try {
    const result1 = js2jeon('{ name: "abc" }');
    console.log('Result:', JSON.stringify(result1, null, 2));
} catch (e) {
    console.log('Error (expected):', e.message);
}

console.log('\nTesting object literal with parentheses:');
try {
    const result2 = js2jeon('({ name: "abc" })');
    console.log('Result:', JSON.stringify(result2, null, 2));
} catch (e) {
    console.log('Error:', e.message);
}

console.log('\nTesting function expression without parentheses:');
try {
    const result3 = js2jeon('function (a, b) { return a + b; }');
    console.log('Result:', JSON.stringify(result3, null, 2));
} catch (e) {
    console.log('Error (expected):', e.message);
}

console.log('\nTesting function expression with parentheses:');
try {
    const result4 = js2jeon('(function (a, b) { return a + b; })');
    console.log('Result:', JSON.stringify(result4, null, 2));
} catch (e) {
    console.log('Error:', e.message);
}