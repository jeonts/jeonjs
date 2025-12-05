import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Generator Function Test ===\n')

try {
    // Test generator function
    const generatorCode = `function* countUpTo(max) {
  yield 1;
  yield 2;
  return max;
}
[...countUpTo(10)]`

    console.log('JavaScript code:')
    console.log(generatorCode)

    // Convert to JEON
    console.log('\nConverting to JEON...')
    const jeon = js2jeon(generatorCode)
    console.log('JEON representation:')
    console.log(JSON.stringify(jeon, null, 2))

    // Try to evaluate with current evalJeon
    console.log('\nAttempting to evaluate with evalJeon...')
    const result = evalJeon(jeon)
    console.log('Evaluation result:', result)
    console.log('Type of result:', typeof result)

    console.log('\n=== Test completed ===')

} catch (error: any) {
    console.error('❌ Error:', error.message)
    console.error('Stack:', error.stack)
}