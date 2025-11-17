// Test how undefined values are handled in JSON
console.log('=== Testing undefined handling ===');

// Create an object with undefined values
const objWithUndefined = {
  "@": {
    "d": undefined,
    "e": undefined,
    "f": 22
  }
};

console.log('Object with undefined:');
console.log(objWithUndefined);

console.log('\nJSON.stringify result:');
console.log(JSON.stringify(objWithUndefined));

// Test what happens when we parse it back
const parsed = JSON.parse(JSON.stringify(objWithUndefined));
console.log('\nParsed back:');
console.log(parsed);

console.log('\nKeys in parsed object:');
console.log(Object.keys(parsed['@']));

// Test if we can detect missing keys
console.log('\nDoes "d" exist in parsed object?', 'd' in parsed['@']);
console.log('Does "e" exist in parsed object?', 'e' in parsed['@']);
console.log('Does "f" exist in parsed object?', 'f' in parsed['@']);