import { js2jeon } from '../js2jeon'

const code = `function a(name) { return ("Hello, " + name) }`

console.log('Original code:')
console.log(code)

console.log('\nGenerated JEON (without IIFE):')
const jeonWithoutIife = js2jeon(code)
console.log(JSON.stringify(jeonWithoutIife, null, 2))

console.log('\nGenerated JEON (with IIFE):')
const jeonWithIife = js2jeon(code, { iife: true })
console.log(JSON.stringify(jeonWithIife, null, 2))