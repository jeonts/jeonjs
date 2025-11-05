import { jeon2js } from '../jeon2js'

console.log('=== Testing Closure Feature ===')

// Test 1: Function declaration with closure disabled (default)
console.log('\n1. Function declaration with closure disabled (default):')
const functionJeon = {
    'function test()': {
        'return': 'Hello World'
    }
}

const regularResult = jeon2js(functionJeon)
console.log(regularResult)

// Test 2: Function declaration with closure enabled
console.log('\n2. Function declaration with closure enabled:')
const closureResult = jeon2js(functionJeon, { closure: true })
console.log(closureResult)

// Test 3: Arrow function with closure disabled (default)
console.log('\n3. Arrow function with closure disabled (default):')
const arrowFunctionJeon = {
    '() =>': {
        'return': 'Hello World'
    }
}

const regularArrowResult = jeon2js(arrowFunctionJeon)
console.log(regularArrowResult)

// Test 4: Arrow function with closure enabled
console.log('\n4. Arrow function with closure enabled:')
const closureArrowResult = jeon2js(arrowFunctionJeon, { closure: true })
console.log(closureArrowResult)

// Test 5: Arrow function with parameters and closure enabled
console.log('\n5. Arrow function with parameters and closure enabled:')
const arrowWithParamsJeon = {
    '(x) =>': {
        'return': { '+': ['Hello World', '@x'] }
    }
}

const arrowWithParamsResult = jeon2js(arrowWithParamsJeon, { closure: true })
console.log(arrowWithParamsResult)

console.log('\n=== All tests completed ===')