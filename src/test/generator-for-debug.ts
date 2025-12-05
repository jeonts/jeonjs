import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Generator For Loop Debug ===\n')

// Test a simple generator with a single yield
const testCode1 = `
function* simpleGen() {
  yield 1;
}
simpleGen()
`

console.log('Test 1: Simple yield')
try {
  const jeon1 = js2jeon(testCode1)
  const result1 = evalJeon(jeon1)
  console.log('Result:', result1.next())
} catch (error: any) {
  console.error('Error:', error.message)
}

console.log('\n---\n')

// Test generator with for loop
const testCode2 = `
function* countTo3() {
  for (let i = 1; i <= 3; i++) {
    yield i;
  }
}
countTo3()
`

console.log('Test 2: Generator with for loop')
try {
  const jeon2 = js2jeon(testCode2)
  console.log('JEON:', JSON.stringify(jeon2, null, 2))

  const result2 = evalJeon(jeon2)
  console.log('First next():', result2.next())
  console.log('Second next():', result2.next())
  console.log('Third next():', result2.next())
  console.log('Fourth next():', result2.next())
} catch (error: any) {
  console.error('Error:', error.message)
}