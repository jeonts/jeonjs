import { js2jeon } from './src/js2jeon'
import { evalJeon } from './src/safeEval'

// Test case21 - function expression in IIFE
console.log('=== Testing case21 ===')
try {
    const code21 = `(function (a){return a+1})(10)`
    const jeon21 = js2jeon(code21, { iife: true })
    console.log('case21 JEON:', JSON.stringify(jeon21))
    const result21 = evalJeon(jeon21)
    console.log('case21 result:', result21)
    console.log('case21 expected: 11')
    console.log('case21 pass:', result21 === 11)
} catch (e) {
    console.error('case21 error:', e.message)
}

console.log('\n=== Testing case34 ===')
try {
    // Test case34 - anonymous function at top level
    const code34 = `function(...a) { return a }`
    const jeon34 = js2jeon(code34, { iife: true })
    console.log('case34 JEON:', JSON.stringify(jeon34))
    const result34 = evalJeon(jeon34)
    console.log('case34 result:', result34)
    console.log('case34 expected: undefined')
    console.log('case34 pass:', result34 === undefined)
} catch (e) {
    console.error('case34 error:', e.message)
}

console.log('\n=== Testing case2_1 ===')
try {
    // Test case2_1 - anonymous function at top level
    const code2_1 = `function (name) { return ("Hello, " + name) }`
    const jeon2_1 = js2jeon(code2_1, { iife: true })
    console.log('case2_1 JEON:', JSON.stringify(jeon2_1))
    const result2_1 = evalJeon(jeon2_1)
    console.log('case2_1 result:', result2_1)
    console.log('case2_1 expected: undefined')
    console.log('case2_1 pass:', result2_1 === undefined)
} catch (e) {
    console.error('case2_1 error:', e.message)
}