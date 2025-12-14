import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

const case35 = `(function(...a) { return a.length })([1, 2, 3, 4, 5])`

console.log('Testing case35:')
console.log('Code:', case35)

try {
    const jeon = js2jeon(case35)
    console.log('JEON:', JSON.stringify(jeon, null, 2))

    // Let's manually evaluate the JEON to see what's happening
    console.log('\n--- Manual Evaluation ---')

    // First, let's see what the function part evaluates to
    const functionPart = jeon["()"][0]
    console.log('Function part:', JSON.stringify(functionPart, null, 2))

    // Try to evaluate just the function part
    const context = {}
    const funcResult = evalJeon(functionPart, context)
    console.log('Function evaluation result:', funcResult)
    console.log('Type of function result:', typeof funcResult)

    if (typeof funcResult === 'function') {
        console.log('Function can be called!')
        const arg = [[1, 2, 3, 4, 5]]
        const result = funcResult(...arg)
        console.log('Result of calling function:', result)
    } else {
        console.log('Function result is not callable')
    }

} catch (error) {
    console.error('Error:', (error as Error).message)
    console.error('Stack:', (error as Error).stack)
}