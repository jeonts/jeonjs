import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

// Test array destructuring cases
const testCases = [
    {
        name: 'Simple array destructuring',
        code: `
const [a, b] = [1, 2];
a + b;
`
    },
    {
        name: 'Array destructuring with holes',
        code: `
const [a, , b] = [1, 2, 3];
a + b;
`
    },
    {
        name: 'Array destructuring with rest',
        code: `
const [first, ...rest] = [1, 2, 3, 4, 5];
first + rest.length;
`
    },
    {
        name: 'Nested array destructuring',
        code: `
const [a, [b, c]] = [1, [2, 3]];
a + b + c;
`
    },
    {
        name: 'Complex array destructuring',
        code: `
const [head, a, b, ...rest] = [1, 2, 3, 4, 5];
a + b;
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