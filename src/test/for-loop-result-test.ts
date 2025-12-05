import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== For Loop Result Test ===\n')

const testCode = `
for (let i = 1; i <= 3; i++) {
  yield i;
}
`

try {
  console.log('Converting to JEON...')
  const jeon = js2jeon(testCode)
  console.log('JEON:', JSON.stringify(jeon, null, 2))

  console.log('Evaluating JEON...')
  const result = evalJeon(jeon)
  console.log('Result:', result)
} catch (error: any) {
  console.error('Error:', error.message)
  console.error(error.stack)
}