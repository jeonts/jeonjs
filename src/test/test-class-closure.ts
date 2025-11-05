import { jeon2js } from '../jeon2js'

console.log('=== Testing Class with Getters/Setters Closure Feature ===')

// Test class with getter/setter with closure disabled (default)
console.log('\n1. Class with getter/setter with closure disabled (default):')
const classJeon = {
    'class Person': {
        'constructor(name)': {
            '=': [{ '.': ['@this', 'name'] }, '@name']
        },
        'get fullName()': {
            'return': { '.': ['@this', 'name'] }
        },
        'set fullName(value)': {
            '=': [{ '.': ['@this', 'name'] }, '@value']
        }
    }
}

const regularClassResult = jeon2js(classJeon)
console.log(regularClassResult)

// Test class with getter/setter with closure enabled
console.log('\n2. Class with getter/setter with closure enabled:')
const closureClassResult = jeon2js(classJeon, { closure: true })
console.log(closureClassResult)

// Test class with method that has parameters and closure enabled
console.log('\n3. Class with method that has parameters and closure enabled:')
const classWithMethodParams = {
    'class Calculator': {
        'add(a, b)': {
            'return': { '+': ['@a', '@b'] }
        }
    }
}

const classWithMethodParamsResult = jeon2js(classWithMethodParams, { closure: true })
console.log(classWithMethodParamsResult)

console.log('\n=== All class tests completed ===')