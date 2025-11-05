import { jeon2js } from '../jeon2js'

console.log('=== Testing Function Expression with Parameters ===')

// Test function expression with parameters and closure disabled (default)
console.log('\n1. Function expression with parameters and closure disabled (default):')
const functionExpressionJeon = {
    'function()': {
        'return': 'Hello World'
    }
}

const regularFunctionExpressionResult = jeon2js(functionExpressionJeon)
console.log(regularFunctionExpressionResult)

// Test function expression with parameters and closure enabled
console.log('\n2. Function expression with parameters and closure enabled:')
const functionExpressionWithParamsJeon = {
    'function(x)': {
        'return': { '+': ['Hello World', '@x'] }
    }
}

const closureFunctionExpressionResult = jeon2js(functionExpressionWithParamsJeon, { closure: true })
console.log(closureFunctionExpressionResult)

console.log('\n=== All function expression tests completed ===')