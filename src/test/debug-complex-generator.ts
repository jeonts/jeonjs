import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Debug Complex Generator ===\n')

// Test the failing case
const complexGeneratorCode = `function* countUpTo(max) {
  let i = 1;
  while (i <= max) {
    yield i++;
  }
}
const counter = countUpTo(3);
[counter.next().value, counter.next().value, counter.next().value]`

console.log('Complex generator code:')
console.log(complexGeneratorCode)

try {
    const jeon = js2jeon(complexGeneratorCode)
    console.log('JEON:', JSON.stringify(jeon, null, 2))
    
    const result = evalJeon(jeon)
    console.log('Result:', result)
} catch (error: any) {
    console.error('Error:', error.message)
    // Let's also log the full error for debugging
    console.error('Full error:', error)
}