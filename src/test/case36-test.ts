import { js2jeon } from '../js2jeon'

const case36 = `function a(...a) { return a.length }
a(1, 2, 3, 4, 5)`

console.log('Testing case36:')
console.log('Code:', case36)

try {
    const jeon = js2jeon(case36)
    console.log('JEON:', JSON.stringify(jeon, null, 2))
} catch (error) {
    console.error('Error:', (error as Error).message)
}