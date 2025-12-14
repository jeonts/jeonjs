import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

// Simple test case
const code = `
new (class {
  constructor(name) {
    this.name = name
  }
})('Ali')
`

console.log('Code:', code)

try {
    const jeon = js2jeon(code, { iife: true })
    console.log('JEON:', JSON.stringify(jeon, null, 2))

    // Let's manually walk through the JEON structure
    console.log('\n--- Manual Walkthrough ---')
    const newOp = jeon['new']
    console.log('newOp:', JSON.stringify(newOp, null, 2))

    const classExpr = newOp[0]
    console.log('classExpr:', JSON.stringify(classExpr, null, 2))

    const classNameKey = Object.keys(classExpr)[0]
    console.log('classNameKey:', classNameKey)

    const classDef = classExpr[classNameKey]
    console.log('classDef:', JSON.stringify(classDef, null, 2))

    const constructorKey = Object.keys(classDef)[0]
    console.log('constructorKey:', constructorKey)

    const constructorBody = classDef[constructorKey]
    console.log('constructorBody:', JSON.stringify(constructorBody, null, 2))

    // Try to evaluate the class expression first
    console.log('\n--- Evaluating class expression ---')
    const classResult = evalJeon(classExpr)
    console.log('Class result:', classResult)

    // Then try to instantiate it
    console.log('\n--- Creating instance ---')
    const instance = new classResult('Ali')
    console.log('Instance:', instance)

} catch (error: any) {
    console.error('Error:', error.message)
    console.error(error.stack)
}