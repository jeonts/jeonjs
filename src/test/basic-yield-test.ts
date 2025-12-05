import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Basic Yield Test ===\n')

const testCode = `
function* simpleGen() {
  yield 1;
  yield 2;
  return 3;
}
simpleGen()
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
    let step = result.next()
    console.log('Step 1:', step)
    if (!step.done) values.push(step.value)

    step = result.next()
    console.log('Step 2:', step)
    if (!step.done) values.push(step.value)

    step = result.next()
    console.log('Step 3:', step)
    if (step.done && step.value !== undefined) {
      console.log('Final return value:', step.value)
    }

    console.log('Collected values:', values)
  }
} catch (error: any) {
  console.error('Error:', error.message)
  console.error(error.stack)
}