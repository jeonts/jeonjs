import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Comprehensive Generator Test ===\n')

// Test the generator function with all values
const generatorCode = `function* countUpTo(max) {
  let i = 1;
  while (i <= max) {
    yield i++;
  }
}`

console.log('Generator code:')
console.log(generatorCode)

try {
  const jeon = js2jeon(generatorCode)
  console.log('JEON:', JSON.stringify(jeon, null, 2))

  // Create a context to hold the function
  const context: any = {}
  console.log('Creating generator function...')
  const result = evalJeon(jeon, context)
  console.log('Generator function created successfully:', typeof result)

  // Now try to call the generator
  console.log('Calling generator function...')
  const gen = result(3)
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