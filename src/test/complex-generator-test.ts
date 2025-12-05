import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Complex Generator Test ===\n')

// Test a more complex generator with nested control structures
const complexGeneratorCode = `
function* fibonacci(max) {
  let a = 0, b = 1;
  while (b <= max) {
    yield b;
    let temp = a + b;
    a = b;
    b = temp;
  }
}
`

console.log('Complex generator code:')
console.log(complexGeneratorCode)

try {
    const jeon = js2jeon(complexGeneratorCode)
    console.log('JEON:', JSON.stringify(jeon, null, 2))
    
    // Create a context to hold the function
    const context: any = {}
    console.log('Creating generator function...')
    const result = evalJeon(jeon, context)
    console.log('Generator function created successfully:', typeof result)
    
    // Now try to call the generator
    console.log('Calling generator function...')
    const gen = result(20)
    console.log('Generator object:', typeof gen)
    
    // Get all values from the generator
    console.log('Getting all values...')
    let count = 1
    let next = gen.next()
    while (!next.done) {
        console.log(`Fibonacci ${count}:`, next.value)
        next = gen.next()
        count++
    }
    console.log('Generator finished')
    
} catch (error: any) {
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
}

console.log('\n---\n')

// Test generator with if statements
const conditionalGeneratorCode = `
function* conditionalNumbers(max) {
  let i = 1;
  while (i <= max) {
    if (i % 2 === 0) {
      yield i * 2;
    } else {
      yield i;
    }
    i++;
  }
}
`

console.log('Conditional generator code:')
console.log(conditionalGeneratorCode)

try {
    const jeon2 = js2jeon(conditionalGeneratorCode)
    console.log('JEON:', JSON.stringify(jeon2, null, 2))
    
    // Create a context to hold the function
    const context2: any = {}
    console.log('Creating conditional generator function...')
    const result2 = evalJeon(jeon2, context2)
    console.log('Conditional generator function created successfully:', typeof result2)
    
    // Now try to call the generator
    console.log('Calling conditional generator function...')
    const gen2 = result2(10)
    console.log('Generator object:', typeof gen2)
    
    // Get all values from the generator
    console.log('Getting all values...')
    let count2 = 1
    let next2 = gen2.next()
    while (!next2.done) {
        console.log(`Value ${count2}:`, next2.value)
        next2 = gen2.next()
        count2++
    }
    console.log('Generator finished')
    
} catch (error: any) {
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
}