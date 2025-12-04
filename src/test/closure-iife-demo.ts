// Demo script showing integration between closure feature and IIFE conversion

import { jeon2js } from '../jeon2js'
import { convertToIIFE } from '../iifeConverter'

console.log('=== Closure and IIFE Integration Demo ===\n')

// Demo 1: Regular mode (closure=false)
console.log('Demo 1: Function declaration in regular mode')
const jeon1 = {
    'function add(a, b)': {
        'return': {
            '+': ['@a', '@b']
        }
    }
}

const result1 = jeon2js(jeon1, { closure: false })
console.log('Input JEON:')
console.log(JSON.stringify(jeon1, null, 2))
console.log('Output JavaScript (regular mode):')
console.log(result1)
console.log('---\n')

// Demo 2: Closure mode (closure=true)
console.log('Demo 2: Function declaration in closure mode')
const result2 = jeon2js(jeon1, { closure: true })
console.log('Input JEON:')
console.log(JSON.stringify(jeon1, null, 2))
console.log('Output JavaScript (closure mode):')
console.log(result2)
console.log('---\n')

// Demo 3: Arrow function comparison
console.log('Demo 3: Arrow function comparison')
const jeon3 = {
    '(x, y) =>': {
        '*': ['@x', '@y']
    }
}

const result3a = jeon2js(jeon3, { closure: false })
console.log('Input JEON:')
console.log(JSON.stringify(jeon3, null, 2))
console.log('Output JavaScript (regular mode):')
console.log(result3a)

const result3b = jeon2js(jeon3, { closure: true })
console.log('Output JavaScript (closure mode):')
console.log(result3b)
console.log('---\n')

// Demo 4: convertToIIFE functionality
console.log('Demo 4: convertToIIFE functionality')
const codeSamples = [
    "const a = 1; a + 2;",
    "[]",
    "{}",
    "class MyClass {}",
    "(function() { return 42; })()"
]

codeSamples.forEach((code, index) => {
    console.log(`Sample ${index + 1}: "${code}"`)
    const result = convertToIIFE(code)
    console.log('Converted to IIFE:')
    console.log(result)
    console.log('')
})

console.log('=== Summary ===')
console.log('1. Regular mode generates direct JavaScript code')
console.log('2. Closure mode wraps function bodies with evalJeon for safe execution')
console.log('3. convertToIIFE wraps JavaScript code in IIFE format with proper return handling')
console.log('4. These are complementary features that serve different purposes in the JEON system')