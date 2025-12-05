import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Property Access Regression Test ===\n')

// Test that property access still works with @ references
console.log('Test: Property access with @ references')
const propAccessCode = `
const obj = { name: "World" };
obj.name
`

try {
    console.log('Code:', propAccessCode)
    const jeon = js2jeon(propAccessCode)
    console.log('JEON:', JSON.stringify(jeon, null, 2))
    const result = evalJeon(jeon)
    console.log('Result:', result)
    console.log('Expected: "World"')
    console.log('✓ Property access with @ references test passed\n')
} catch (error: any) {
    console.error('✗ Property access with @ references test failed:', error.message)
    console.log('')
}

// Test that property access works with computed property names
console.log('Test: Property access with variable property names')
const computedPropCode = `
const obj = { greet: "Hello" };
const prop = "greet";
obj[prop]
`

try {
    console.log('Code:', computedPropCode)
    const jeon2 = js2jeon(computedPropCode)
    console.log('JEON:', JSON.stringify(jeon2, null, 2))
    const result2 = evalJeon(jeon2)
    console.log('Result:', result2)
    console.log('Expected: "Hello"')
    console.log('✓ Property access with variable property names test passed\n')
} catch (error: any) {
    console.error('✗ Property access with variable property names test failed:', error.message)
    console.log('')
}

console.log('=== Property access regression tests completed ===')