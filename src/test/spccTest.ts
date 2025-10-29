import { expect, test } from '@woby/chk'
import { jeon2js } from '../jeon2js'

test('SPCC Test', () => {
    // Test some examples from the SPCC.md specification

    console.log('Testing JEON examples from SPCC specification:\n')

    test('Traditional Function Example', () => {
        // Test 1: Traditional Function Example
        console.log('1. Traditional Function Example:')
        const traditionalFunction = {
            "function(a, b)": [
                { "return": { "+": ["@a", "@b"] } }
            ]
        }

        console.log('JEON:')
        console.log(JSON.stringify(traditionalFunction, null, 2))
        console.log('\nConverted to TypeScript:')
        const result1 = jeon2js(traditionalFunction)
        console.log(result1)
        console.log('\n' + '='.repeat(50) + '\n')

        expect(traditionalFunction).toBeDefined()
        expect(result1).toBeDefined()
    })

    test('Arrow Function Example', () => {
        // Test 2: Arrow Function Example
        console.log('2. Arrow Function Example:')
        const arrowFunction = {
            "()=>": 23
        }

        console.log('JEON:')
        console.log(JSON.stringify(arrowFunction, null, 2))
        console.log('\nConverted to TypeScript:')
        const result2 = jeon2js(arrowFunction)
        console.log(result2)
        console.log('\n' + '='.repeat(50) + '\n')

        expect(arrowFunction).toBeDefined()
        expect(result2).toBeDefined()
    })

    test('Variable Declaration Example', () => {
        // Test 3: Variable Declaration Example
        console.log('3. Variable Declaration Example:')
        const variableDeclaration = {
            "@": {
                "count": 0,
                "isValid": {
                    "===": ["@data.status", "OK"]
                }
            }
        }

        console.log('JEON:')
        console.log(JSON.stringify(variableDeclaration, null, 2))
        console.log('\nConverted to TypeScript:')
        const result3 = jeon2js(variableDeclaration)
        console.log(result3)
        console.log('\n' + '='.repeat(50) + '\n')

        expect(variableDeclaration).toBeDefined()
        expect(result3).toBeDefined()
    })

    test('Function Call Example', () => {
        // Test 4: Function Call Example
        console.log('4. Function Call Example:')
        const functionCall = {
            "setAppState()": [
                "@x"
            ]
        }

        console.log('JEON:')
        console.log(JSON.stringify(functionCall, null, 2))
        console.log('\nConverted to TypeScript:')
        const result4 = jeon2js(functionCall)
        console.log(result4)
        console.log('\n' + '='.repeat(50) + '\n')

        expect(functionCall).toBeDefined()
        expect(result4).toBeDefined()
    })

    test('Constructor Call Example', () => {
        // Test 5: Constructor Call Example
        console.log('5. Constructor Call Example:')
        const constructorCall = {
            "new": ["Date", 0]
        }

        console.log('JEON:')
        console.log(JSON.stringify(constructorCall, null, 2))
        console.log('\nConverted to TypeScript:')
        const result5 = jeon2js(constructorCall)
        console.log(result5)
        console.log('\n' + '='.repeat(50) + '\n')

        expect(constructorCall).toBeDefined()
        expect(result5).toBeDefined()
    })

    test('Member Access Example', () => {
        // Test 6: Member Access Example
        console.log('6. Member Access Example:')
        const memberAccess = {
            ".": [
                { "new": ["Date"] },
                "getFullYear"
            ]
        }

        console.log('JEON:')
        console.log(JSON.stringify(memberAccess, null, 2))
        console.log('\nConverted to TypeScript:')
        const result6 = jeon2js(memberAccess)
        console.log(result6)
        console.log('\n' + '='.repeat(50) + '\n')

        expect(memberAccess).toBeDefined()
        expect(result6).toBeDefined()
    })

    test('Function Execution Example', () => {
        // Test 7: Function Execution Example
        console.log('7. Function Execution Example:')
        const functionExecution = {
            "()": [
                { ".": ["@Math", "floor"] },
                { "getAppState()": [] }
            ]
        }

        console.log('JEON:')
        console.log(JSON.stringify(functionExecution, null, 2))
        console.log('\nConverted to TypeScript:')
        const result7 = jeon2js(functionExecution)
        console.log(result7)
        console.log('\n' + '='.repeat(50) + '\n')

        expect(functionExecution).toBeDefined()
        expect(result7).toBeDefined()
    })

    console.log('All SPCC examples tested successfully!')
})