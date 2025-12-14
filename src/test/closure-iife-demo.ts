// Demo script showing integration between closure feature and IIFE conversion

import { jeon2js } from '../jeon2js'
import { convertToIIFE } from '../iifeConverter'

console.log('=== Closure and IIFE Integration Demo ===\n')

// Demo 1: Function declaration
console.log('Demo 1: Function declaration')
const jeon1 = {
    'function add(a, b)': {
        'return': {
            '+': ['@a', '@b']
        }
    }
}

const result1 = jeon2js(jeon1)
console.log('Input JEON:')
console.log(JSON.stringify(jeon1, null, 2))
console.log('Output JavaScript (regular mode):')
console.log(result1)
console.log('---\n')

// Demo 2: Same function declaration
console.log('Demo 2: Same function declaration')
const result2 = jeon2js(jeon1)
console.log('Input JEON:')
console.log(JSON.stringify(jeon1, null, 2))
console.log('Output JavaScript:')
console.log(result2)
console.log('---\n')

// Demo 3: Arrow function comparison
console.log('Demo 3: Arrow function comparison')
const jeon3 = {
    '(x, y) =>': {
        '*': ['@x', '@y']
    }
}

const result3a = jeon2js(jeon3)
console.log('Input JEON:')
console.log(JSON.stringify(jeon3, null, 2))
console.log('Output JavaScript:')
console.log(result3a)
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
console.log('1. jeon2js converts JEON to JavaScript code')
console.log('2. convertToIIFE wraps JavaScript code in IIFE format with proper return handling')
console.log('3. These features serve different purposes in the JEON system')