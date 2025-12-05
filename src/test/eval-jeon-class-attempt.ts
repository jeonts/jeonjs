import { evalJeon } from '../safeEval'

console.log('=== Attempting to evalJeon a class declaration ===\n')

try {
    // Your attempted approach
    const jeonString = '{"class Person":{"constructor(name)":[{"=":[{".":["@this","name"]},"@name"]}],"greet()":[{"return":{"(":{"+":["Hello, ",{".":["@this","name"]}]}}}]}}'

    console.log('1. Original JEON string:')
    console.log(jeonString)

    console.log('\n2. What happens with JSON.stringify on a string:')
    console.log(JSON.stringify(jeonString))

    console.log('\n3. Attempting evalJeon with JSON.stringify...')
    const result1 = evalJeon(JSON.stringify(jeonString))
    console.log('Result:', result1)

} catch (error: any) {
    console.error('Error with JSON.stringify approach:', error.message)
}

console.log('\n---')

try {
    // Even with proper JSON parsing, it still won\'t work
    const jeonString = '{"class Person":{"constructor(name)":[{"=":[{".":["@this","name"]},"@name"]}],"greet()":[{"return":{"(":{"+":["Hello, ",{".":["@this","name"]}]}}}]}}'
    const jeonObj = JSON.parse(jeonString)

    console.log('\n4. Properly parsed JEON object:')
    console.log(JSON.stringify(jeonObj, null, 2))

    console.log('\n5. Attempting evalJeon with parsed object...')
    const result2 = evalJeon(jeonObj)
    console.log('Result:', result2)

} catch (error: any) {
    console.error('Error with parsed object approach:', error.message)
}

console.log('\n=== Conclusion: evalJeon cannot directly process class declarations ===')