import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'

// Test different JSX structures
const testCases = [
    {
        name: 'Simple JSX element',
        code: `<div>Hello World</div>`
    },
    {
        name: 'JSX with attributes',
        code: `<div className="container" id="main">Hello World</div>`
    },
    {
        name: 'Nested JSX elements',
        code: `<div className="container">
  <h1>Hello World</h1>
  <p>This is a paragraph</p>
</div>`
    },
    {
        name: 'JSX with expressions',
        code: `<div className="container">
  <h1>Hello {name}</h1>
</div>`
    },
    {
        name: 'Self-closing JSX element',
        code: `<img src="image.jpg" alt="An image" />`
    }
]

console.log('=== JSX Mode Testing ===\n')

for (const { name, code } of testCases) {
    console.log(`\n--- ${name} ---`)
    console.log('Code:', code)

    try {
        // Convert to JEON
        const jeon = js2jeon(code, { iife: true })
        console.log('JEON:', JSON.stringify(jeon, null, 2))

        // Test jsx=false (default)
        const jsDefault = jeon2js(jeon, { jsx: false })
        console.log('jsx=false:', jsDefault)

        // Test jsx=true
        const jsJsxFunction = jeon2js(jeon, { jsx: true })
        console.log('jsx=true:', jsJsxFunction)

    } catch (error: any) {
        console.error('Error:', error.message)
        console.error(error.stack)
    }
}