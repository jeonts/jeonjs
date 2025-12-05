import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Debug Test ===\n')

const testCode = `
function* countToN(n) {
  for (let i = 1; i <= n; i++) {
    yield i;
  }
}
countToN(5)
`

try {
  console.log('Converting to JEON...')
  const jeon = js2jeon(testCode)
  console.log('JEON:', JSON.stringify(jeon, null, 2))

  console.log('Evaluating JEON...')
  const result = evalJeon(jeon)
  console.log('Result:', result)

  if (result && typeof result === 'object' && typeof result.next === 'function') {
    console.log('Iterating through generator...')
    const values = []
    for (let i = 0; i < 5; i++) {
      const step = result.next()
      console.log(`Step ${i}:`, step)
      if (step.done) break
      values.push(step.value)
    }
    console.log('Values:', values)
  }
} catch (error: any) {
  console.error('Error:', error.message)
  console.error(error.stack)
}