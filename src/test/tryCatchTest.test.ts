import { expect, test } from '@woby/chk'
import { jeon2js } from '../jeon2js'

test('Try Catch Test', () => {
    test('Try/catch/finally conversion', () => {
        // Test try/catch/finally conversion
        const tryCatchJEON = {
            "try": {
                "body": [
                    {
                        "return": "success"
                    }
                ],
                "catch": {
                    "param": "error",
                    "body": [
                        {
                            "return": "failure"
                        }
                    ]
                },
                "finally": [
                    {
                        "return": "cleanup"
                    }
                ]
            }
        }

        console.log('Testing try/catch/finally conversion...')
        console.log('JEON:')
        console.log(JSON.stringify(tryCatchJEON, null, 2))

        try {
            const js = jeon2js(tryCatchJEON)
            console.log('\nGenerated JavaScript:')
            console.log(js)
            
            expect(js).toBeDefined()
        } catch (error) {
            console.error('Error in conversion:', error)
            expect(error).toBeUndefined()
        }
    })

    test('Try/catch only (no finally) conversion', () => {
        // Test try/catch only (no finally)
        const tryCatchOnlyJEON = {
            "try": {
                "body": [
                    {
                        "return": "success"
                    }
                ],
                "catch": {
                    "param": "error",
                    "body": [
                        {
                            "return": "failure"
                        }
                    ]
                }
            }
        }

        console.log('\n\nTesting try/catch only (no finally)...')
        console.log('JEON:')
        console.log(JSON.stringify(tryCatchOnlyJEON, null, 2))

        try {
            const js = jeon2js(tryCatchOnlyJEON)
            console.log('\nGenerated JavaScript:')
            console.log(js)
            
            expect(js).toBeDefined()
        } catch (error) {
            console.error('Error in conversion:', error)
            expect(error).toBeUndefined()
        }
    })

    test('Try/finally only (no catch) conversion', () => {
        // Test try/finally only (no catch)
        const tryFinallyOnlyJEON = {
            "try": {
                "body": [
                    {
                        "return": "success"
                    }
                ],
                "finally": [
                    {
                        "return": "cleanup"
                    }
                ]
            }
        }

        console.log('\n\nTesting try/finally only (no catch)...')
        console.log('JEON:')
        console.log(JSON.stringify(tryFinallyOnlyJEON, null, 2))

        try {
            const js = jeon2js(tryFinallyOnlyJEON)
            console.log('\nGenerated JavaScript:')
            console.log(js)
            
            expect(js).toBeDefined()
        } catch (error) {
            console.error('Error in conversion:', error)
            expect(error).toBeUndefined()
        }
    })
})