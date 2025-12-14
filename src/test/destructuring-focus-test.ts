import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

// Test the destructuring cases specifically
const testCases = [
    {
        name: 'case37 - Object destructuring with rest',
        code: `
const {a,b, ...rest} = {a:1, b:3}
a+b
`
    },
    {
        name: 'case38 - Array destructuring',
        code: `
const [head, a,b, ...rest] = [1, 2, 3, 4, 5]
a+b
`
    },
    {
        name: 'case40 - Array destructuring with holes',
        code: `
const [a, , b] = [1, 2, 3]
a + b
`
    },
    {
        name: 'case41 - Array destructuring with rest',
        code: `
const [first, ...rest] = [1, 2, 3, 4, 5]
first + rest.length
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