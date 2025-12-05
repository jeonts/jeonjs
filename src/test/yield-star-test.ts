import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Yield Star Test ===\n')

// Test generator with yield*
const yieldStarCode = `
function* delegateGenerator() {
  yield 1;
  yield 2;
}

function* delegatingGenerator() {
  yield 0;
  yield* delegateGenerator();
  yield 3;
}
`

console.log('Yield star code:')
console.log(yieldStarCode)

try {
    const jeon = js2jeon(yieldStarCode)
    console.log('JEON:', JSON.stringify(jeon, null, 2))
    
    // Create a context to hold the functions
    const context: any = {}
    console.log('Creating generator functions...')
    evalJeon(jeon, context)
    
    // Get the delegating generator function
    const delegatingGenFunc = context.delegatingGenerator
    console.log('Generator functions created successfully')
    
    // Now try to call the generator
    console.log('Calling delegating generator function...')
    const gen = delegatingGenFunc()
    console.log('Generator object:', typeof gen)
    
    // Get all values from the generator
    console.log('Getting all values...')
    let count = 1
    let next = gen.next()
    while (!next.done) {
        console.log(`Value ${count}:`, next.value)
        next = gen.next()
        count++
    }
    console.log('Generator finished')
    
} catch (error: any) {
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
}