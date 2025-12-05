import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Debug Generator Issue ===\n')

// Let's test a simpler case
const simpleGeneratorCode = `function* simpleGen() {
  yield 1;
}
simpleGen()`

console.log('Simple generator code:')
console.log(simpleGeneratorCode)

try {
    const jeon = js2jeon(simpleGeneratorCode)
    console.log('JEON:', JSON.stringify(jeon, null, 2))
    
    const result = evalJeon(jeon)
    console.log('Result:', result)
} catch (error: any) {
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
}