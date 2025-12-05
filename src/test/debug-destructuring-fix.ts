import { js2jeon } from '../js2jeon'

console.log('=== Debug Destructuring Fix ===\n')

const case37 = `
const {a,b} = {a:1, b:3}
a+b
`

console.log('Code:')
console.log(case37)

console.log('\n--- With iife: true ---')
try {
  const jeon = js2jeon(case37, { iife: true })
  console.log('JEON:')
  console.log(JSON.stringify(jeon, null, 2))
} catch (error: any) {
  console.error('❌ Error:', error.message)
}

console.log('\n--- Without iife option ---')
try {
  const jeon = js2jeon(case37)
  console.log('JEON:')
  console.log(JSON.stringify(jeon, null, 2))
} catch (error: any) {
  console.error('❌ Error:', error.message)
}