import { expect, test } from '@woby/chk'
import { jeon2js } from '../jeon2js'

test('Closure feature tests', () => {
    test('Function declaration with closure disabled (default)', () => {
        const jeon = {
            'function test()': {
                'return': 'Hello World'
            }
        }

        const result = jeon2js(jeon)
        expect(result).toBe('function test() {\n  return "Hello World"\n}')
    })

    test('Function declaration with closure enabled', () => {
        const jeon = {
            'function test()': {
                'return': 'Hello World'
            }
        }

        const result = jeon2js(jeon, { closure: true })
        expect(result).toContain('evalJeon')
    })

    test('Arrow function with closure disabled (default)', () => {
        const jeon = {
            '() =>': {
                'return': 'Hello World'
            }
        }

        const result = jeon2js(jeon)
        expect(result).toBe('() => { return "Hello World"; }')
    })

    test('Arrow function with closure enabled', () => {
        const jeon = {
            '() =>': {
                'return': 'Hello World'
            }
        }

        const result = jeon2js(jeon, { closure: true })
        expect(result).toContain('evalJeon')
    })
})