import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'

test('Comprehensive Parentheses Support Tests', () => {
    test('should convert empty object in parentheses from JS to JEON', () => {
        const code = '({})'
        const jeon = js2jeon(code)

        expect(jeon).toEqual({
            '(': {}
        })
    })

    test('should convert binary expression in parentheses from JS to JEON', () => {
        const code = '(1+2)'
        const jeon = js2jeon(code)

        expect(jeon).toEqual({
            '(': {
                '+': [1, 2]
            }
        })
    })

    test('should convert nested parentheses from JS to JEON', () => {
        const code = '((1+2))'
        const jeon = js2jeon(code)

        expect(jeon).toEqual({
            '(': {
                '(': {
                    '+': [1, 2]
                }
            }
        })
    })

    test('should convert empty object in parentheses from JEON to JS', () => {
        const jeon = {
            '(': {}
        }
        const code = jeon2js(jeon)

        expect(code).toBe('({})')
    })

    test('should convert binary expression in parentheses from JEON to JS', () => {
        const jeon = {
            '(': {
                '+': [1, 2]
            }
        }
        const code = jeon2js(jeon)

        expect(code).toBe('(1 + 2)')
    })

    test('should convert nested parentheses from JEON to JS', () => {
        const jeon = {
            '(': {
                '(': {
                    '+': [1, 2]
                }
            }
        }
        const code = jeon2js(jeon)

        expect(code).toBe('(1 + 2)')
    })

    test('should round-trip simple parentheses expressions', () => {
        const originalCode = '(1+2)'
        const jeon = js2jeon(originalCode)
        const convertedCode = jeon2js(jeon)

        // Parse both and compare ASTs
        const originalJeon = js2jeon(originalCode)
        const convertedJeon = js2jeon(convertedCode)

        expect(convertedJeon).toEqual(originalJeon)
    })

    test('should round-trip nested parentheses expressions', () => {
        const originalCode = '((1+2))'
        const jeon = js2jeon(originalCode)
        const convertedCode = jeon2js(jeon)

        // Parse both and compare ASTs
        const originalJeon = js2jeon(originalCode)
        const convertedJeon = js2jeon(convertedCode)

        expect(convertedJeon).toEqual(originalJeon)
    })
})