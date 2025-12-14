import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'

// Test JSX functionality
const code = `<div className="container">
  <h1>Hello World</h1>
</div>`

console.log('Testing JSX functionality...\n')
console.log('Input code:', code)

try {
    // Convert to JEON
    const jeon = js2jeon(code)
    console.log('\nJEON representation:')
    console.log(JSON.stringify(jeon, null, 2))

    // Test with jsx=false (default)
    const jsResultDefault = jeon2js(jeon, { jsx: false })
    console.log('\nJavaScript output with jsx=false:')
    console.log(jsResultDefault)

    // Test with jsx=true
    const jsResultJsx = jeon2js(jeon, { jsx: true })
    console.log('\nJavaScript output with jsx=true:')
    console.log(jsResultJsx)

    console.log('\nTest completed successfully!')
} catch (error: any) {
    console.error('Error:', error.message)
    console.error(error.stack)
}