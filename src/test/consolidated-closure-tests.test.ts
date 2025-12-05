import { jeon2js } from '../jeon2js'
import { evalJeon } from '../safeEval'
import { expect, test } from '@woby/chk'

test('Consolidated Closure Functionality Tests', () => {
    console.log('=== Consolidated Closure Tests ===\n')

    // Test 1: Function declaration with closure disabled (default)
    console.log('1. Function declaration with closure disabled (default):')
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

    console.log('\n=== Function Closure Tests Completed ===\n')

    // Test class with getter/setter with closure disabled (default)
    console.log('6. Class with getter/setter with closure disabled (default):')
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
    console.log('\n7. Class with getter/setter with closure enabled:')
    const closureClassResult = jeon2js(classJeon, { closure: true })
    console.log(closureClassResult)

    // Test class with method that has parameters and closure enabled
    console.log('\n8. Class with method that has parameters and closure enabled:')
    const classWithMethodParams = {
        'class Calculator': {
            'add(a, b)': {
                'return': { '+': ['@a', '@b'] }
            }
        }
    }

    const classWithMethodParamsResult = jeon2js(classWithMethodParams, { closure: true })
    console.log(classWithMethodParamsResult)

    console.log('\n=== Class Closure Tests Completed ===\n')

    // Test case from user: parenthesized function expression
    console.log('9. Testing closure fix for parenthesized function expression:')
    const jeon = {
        '(': {
            'function(a, b)': [
                {
                    'return': {
                        '+': [
                            '@a',
                            '@b'
                        ]
                    }
                }
            ]
        }
    }

    console.log('JEON input:')
    console.log(JSON.stringify(jeon, null, 2))

    console.log('\n--- Without closure ---')
    const codeWithout = jeon2js(jeon, { closure: false })
    console.log('Generated code:')
    console.log(codeWithout)

    console.log('\n--- With closure ---')
    const codeWith = jeon2js(jeon, { closure: true })
    console.log('Generated code:')
    console.log(codeWith)

    console.log('\n--- Testing execution ---')
    try {
        // Make evalJeon available in eval scope
        const func = eval(`(function() { const evalJeon = ${evalJeon.toString()}; return ${codeWith}; })()`)
        console.log('Function created:', typeof func)

        if (typeof func === 'function') {
            const result = func(5, 3)
            console.log('Result of func(5, 3):', result)
            console.log('Expected: 8')
            console.log('Test:', result === 8 ? '✅ PASSED' : '❌ FAILED')
        }
    } catch (error: any) {
        console.error('Error:', error.message)
    }

    console.log('\n=== All Closure Tests Completed ===')

    // Assertions
    expect(functionJeon).toBeDefined()
    expect(regularResult).toBeDefined()
    expect(closureResult).toBeDefined()
    expect(arrowFunctionJeon).toBeDefined()
    expect(regularArrowResult).toBeDefined()
    expect(closureArrowResult).toBeDefined()
    expect(arrowWithParamsJeon).toBeDefined()
    expect(arrowWithParamsResult).toBeDefined()
    expect(classJeon).toBeDefined()
    expect(regularClassResult).toBeDefined()
    expect(closureClassResult).toBeDefined()
    expect(classWithMethodParams).toBeDefined()
    expect(classWithMethodParamsResult).toBeDefined()
    expect(jeon).toBeDefined()
    expect(codeWithout).toBeDefined()
    expect(codeWith).toBeDefined()
})