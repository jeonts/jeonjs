import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { evalJeon } from '../safeEval'

console.log('=== Final Arrow Function Format Test ===\n')

// Test the examples from the specification
console.log('1. Testing () => 42 (no parameters):')
const noParamCode = 'const fn = () => 42; fn()'
console.log(`Code: ${noParamCode}`)

try {
    const jeon = js2jeon(noParamCode)
    console.log('JEON:', JSON.stringify(jeon, null, 2))

    // Check that the arrow function has the correct format
    const arrowFunction = (jeon as any[])[0]['@@']['fn']
    const hasCorrectFormat = Object.keys(arrowFunction)[0] === '() =>'

    if (hasCorrectFormat) {
        console.log('✅ Correct format: "() =>" key found')
    } else {
        console.log('❌ Incorrect format')
        console.log('Keys found:', Object.keys(arrowFunction))
    }

    const result = evalJeon(jeon)
    console.log('Result:', result)
    console.log('✅ Success\n')
} catch (error: any) {
    console.log('❌ Error:', error.message, '\n')
}

console.log('2. Testing (a, b) => a + b (with parameters):')
const withParamCode = 'const add = (a, b) => a + b; add(3, 4)'
console.log(`Code: ${withParamCode}`)

try {
    const jeon = js2jeon(withParamCode)
    console.log('JEON:', JSON.stringify(jeon, null, 2))

    // Check that the arrow function has the correct format
    const arrowFunction = (jeon as any[])[0]['@@']['add']
    const key = Object.keys(arrowFunction)[0]
    const hasCorrectFormat = key === '(a, b) =>'

    if (hasCorrectFormat) {
        console.log('✅ Correct format: "(a, b) =>" key found')
    } else {
        console.log('❌ Incorrect format')
        console.log('Key found:', key)
    }

    const result = evalJeon(jeon)
    console.log('Result:', result)
    console.log('✅ Success\n')
} catch (error: any) {
    console.log('❌ Error:', error.message, '\n')
}

console.log('3. Testing IIFE with arrow function:')
const iifeCode = '(() => { const x = 42; return x * 2; })()'
console.log(`Code: ${iifeCode}`)

try {
    const jeon = js2jeon(iifeCode)
    console.log('JEON:', JSON.stringify(jeon, null, 2))

    // Check that the IIFE arrow function has the correct format
    const iifeStructure = jeon as any
    const arrowFunction = iifeStructure['()'][0]
    const hasCorrectFormat = Object.keys(arrowFunction)[0] === '() =>'

    if (hasCorrectFormat) {
        console.log('✅ Correct format: "() =>" key found in IIFE')
    } else {
        console.log('❌ Incorrect format in IIFE')
        console.log('Keys found:', Object.keys(arrowFunction))
    }

    const result = evalJeon(jeon)
    console.log('Result:', result)
    console.log('✅ Success\n')
} catch (error: any) {
    console.log('❌ Error:', error.message, '\n')
}

console.log('=== Test Completed ===')