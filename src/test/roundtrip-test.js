const { js2jeon } = require('./dist/jeon-converter.cjs.js');
const { jeon2js } = require('./dist/jeon-converter.cjs.js');

console.log('Testing function declarations with variable statements:');

const code = `function sum(a, b) {let d;const f = 22;var g;  return a + b;};function min(a, b){return Math.min(a,b)};function main(a, b){return min(sum(a,b))}`;

console.log('Original code:');
console.log(code);

try {
    // Convert JS to JEON
    const jeon = js2jeon(code);
    console.log('\nJEON output:');
    console.log(JSON.stringify(jeon, null, 2));

    // Convert JEON back to JS
    const regenerated = jeon2js(jeon);
    console.log('\nRegenerated code:');
    console.log(regenerated);
} catch (e) {
    console.log('Error:', e.message);
    console.log(e.stack);
}