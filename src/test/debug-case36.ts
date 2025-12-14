import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

const case36 = `function a(...a) { return a.length }
a(1, 2, 3, 4, 5)`

console.log('Testing case36:')
console.log('Code:', case36)

try {
    const jeon = js2jeon(case36)
    console.log('JEON:', JSON.stringify(jeon, null, 2))

    // Let's manually evaluate the JEON to see what's happening
    console.log('\n--- Manual Evaluation ---')

    // First, let's evaluate the function declaration part
    const functionDeclPart = jeon[0]
    console.log('Function declaration part:', JSON.stringify(functionDeclPart, null, 2))

    // Try to evaluate the function declaration
    const context = {}
    const declResult = evalJeon(functionDeclPart, context)
    console.log('Function declaration evaluation result:', declResult)
    console.log('Context after declaration:', Object.keys(context))

    // Now let's evaluate the function call part
    const functionCallPart = jeon[1]
    console.log('Function call part:', JSON.stringify(functionCallPart, null, 2))

    // Try to evaluate the function call
    const callResult = evalJeon(functionCallPart, context)
    console.log('Function call evaluation result:', callResult)

} catch (error) {
    console.error('Error:', (error as Error).message)
    console.error('Stack:', (error as Error).stack)
}