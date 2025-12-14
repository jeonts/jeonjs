import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

// Test object destructuring cases
const testCases = [
    {
        name: 'Simple object destructuring',
        code: `
const {a, b} = {a: 1, b: 2};
a + b;
`
    },
    {
        name: 'Object destructuring with rest',
        code: `
const {a, b, ...rest} = {a: 1, b: 2, c: 3, d: 4};
a + b + rest.c + rest.d;
`
    }
]

// Test each case
testCases.forEach(({ name, code }) => {
    try {
        console.log("Testing " + name + "...")
        const jeon = js2jeon(code, { iife: true })
        console.log("JEON for " + name + ": " + JSON.stringify(jeon, null, 2))
        const result = evalJeon(jeon)
        console.log("Result for " + name + ": " + result)
        console.log('---')
    } catch (error: any) {
        console.error("Error in " + name + ": " + error.message)
        console.error(error.stack)
        console.log('---')
    }
})