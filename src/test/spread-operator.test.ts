// Test for spread operator functionality
import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

test('Arrow function with spread operator', () => {
    // Test the specific case: (a)=>([...[1,2,5,a]])
    const code = '(a)=>([...[1,2,5,a]])'
    const context = { a: 23 }

    const jeon = js2jeon(code)
    const result = evalJeon(jeon, context)

    // The result should be a function
    expect(typeof result).toBe('function')

    // Call the function with argument 23
    const callResult = result(23)

    // The result should be [1, 2, 5, 23]
    expect(callResult).toEqual([1, 2, 5, 23])
})

test('Array with spread operator', () => {
    // Test a direct array with spread: [...[1,2,3]]
    const context = {}

    // Create JEON structure for [...[1,2,3]]
    const jeon = {
        "[": [
            {
                "...": {
                    "[": [1, 2, 3]
                }
            }
        ]
    }

    const result = evalJeon(jeon, context)

    // The result should be [1, 2, 3]
    expect(result).toEqual([1, 2, 3])
})

test('Array with multiple spread operators', () => {
    // Test: [...[1,2], ...[3,4]]
    const context = {}

    // Create JEON structure for [...[1,2], ...[3,4]]
    const jeon = {
        "[": [
            {
                "...": {
                    "[": [1, 2]
                }
            },
            {
                "...": {
                    "[": [3, 4]
                }
            }
        ]
    }

    const result = evalJeon(jeon, context)

    // The result should be [1, 2, 3, 4]
    expect(result).toEqual([1, 2, 3, 4])
})

test('Array with mixed elements and spread', () => {
    // Test: [1, ...[2,3], 4]
    const context = {}

    // Create JEON structure for [1, ...[2,3], 4]
    const jeon = {
        "[": [
            1,
            {
                "...": {
                    "[": [2, 3]
                }
            },
            4
        ]
    }

    const result = evalJeon(jeon, context)

    // The result should be [1, 2, 3, 4]
    expect(result).toEqual([1, 2, 3, 4])
})

console.log('🎉 All spread operator tests completed!')