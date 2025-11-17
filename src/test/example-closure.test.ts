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

    console.log('=== Regular Mode (closure=false) ===')
    const regularJs = jeon2js(functionJeon)
    console.log('Generated JavaScript:')
    console.log(regularJs)

    console.log('\n=== Closure Mode (closure=true) ===')
    const closureJs = jeon2js(functionJeon, { closure: true })
    console.log('Generated JavaScript with closure:')
    console.log(closureJs)

    // Example with arrow function
    const arrowFunctionJeon = {
        'async (x, y) =>': {
            '*': ['@x', '@y']
        }
    }

    console.log('\n=== Arrow Function - Regular Mode ===')
    const regularArrowJs = jeon2js(arrowFunctionJeon)
    console.log(regularArrowJs)

    console.log('\n=== Arrow Function - Closure Mode ===')
    const closureArrowJs = jeon2js(arrowFunctionJeon, { closure: true })
    console.log(closureArrowJs)

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

    console.log('\n=== Class with Getters - Regular Mode ===')
    const regularClassJs = jeon2js(classJeon)
    console.log(regularClassJs)

    console.log('\n=== Class with Getters - Closure Mode ===')
    const closureClassJs = jeon2js(classJeon, { closure: true })
    console.log(closureClassJs)

    // Assertions
    expect(functionJeon).toBeDefined()
    expect(arrowFunctionJeon).toBeDefined()
    expect(classJeon).toBeDefined()
    expect(regularJs).toBeDefined()
    expect(closureJs).toBeDefined()
    expect(regularArrowJs).toBeDefined()
    expect(closureArrowJs).toBeDefined()
    expect(regularClassJs).toBeDefined()
    expect(closureClassJs).toBeDefined()
})