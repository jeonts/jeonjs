import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { expect, test } from '@woby/chk'

test('Debug Math.abs conversion', () => {
    const jsCode = `function sum(a, b) {
      return Math.abs(-a + -b);
    }`

    console.log('Original JS:', jsCode)

    // Convert JS to JEON
    const jeon = js2jeon(jsCode)
    console.log('JEON:', JSON.stringify(jeon, null, 2))

    // Convert JEON back to JS
    const convertedJs = jeon2js(jeon)
    console.log('Converted JS:', convertedJs)

    // Assertions
    expect(jsCode).toBeDefined()
    expect(jeon).toBeDefined()
    expect(convertedJs).toBeDefined()
})