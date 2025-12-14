import { jeon2js } from '../jeon2js'
import { evalJeon } from '../safeEval'
import { expect, test } from '@woby/chk'

test('Example demonstrating closure feature for safe evaluation', () => {
    // Example demonstrating the closure feature for safe evaluation

    // Regular function declaration
    const functionJeon = {
        'function greet(name)': {
            'return': { '+': ['Hello ', '@name'] }
        }
    }

    console.log('=== Conversion Mode ===')
    const js = jeon2js(functionJeon)
    console.log('Generated JavaScript:')
    console.log(js)

    // Example with arrow function
    const arrowFunctionJeon = {
        'async (x, y) =>': {
            '*': ['@x', '@y']
        }
    }

    console.log('\n=== Arrow Function Conversion ===')
    const arrowJs = jeon2js(arrowFunctionJeon)
    console.log(arrowJs)

    // Example with class containing getters/setters
    const classJeon = {
        'class Person': {
            'constructor(name)': {
                '=': [{ '.': ['@this', 'name'] }, '@name']
            },
            'get fullName()': {
                'return': { '.': ['@this', 'name'] }
            }
        }
    }

    console.log('\n=== Class with Getters Conversion ===')
    const classJs = jeon2js(classJeon)
    console.log(classJs)

    // Assertions
    expect(functionJeon).toBeDefined()
    expect(arrowFunctionJeon).toBeDefined()
    expect(classJeon).toBeDefined()
    expect(js).toBeDefined()
    expect(arrowJs).toBeDefined()
    expect(classJs).toBeDefined()
})