import { js2jeon } from '../js2jeon'

const case35 = `(function(...a) { return a.length })([1, 2, 3, 4, 5])`

console.log('Testing case35:')
console.log('Code:', case35)

try {
    const jeon = js2jeon(case35)
    console.log('JEON:', JSON.stringify(jeon, null, 2))
} catch (error) {
    console.error('Error:', (error as Error).message)
}