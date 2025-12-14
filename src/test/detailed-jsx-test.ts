import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

// Mock jsx function to see what gets called
function jsx(tag: string, props: any) {
    console.log(`jsx('${tag}', ${JSON.stringify(props)})`)
    return {
        type: 'jsx',
        tag,
        props
    }
}

const code = `<div className="container">
  <h1>Hello World</h1>
  <p>Another paragraph</p>
</div>`

console.log('Code:', code)

try {
    const jeon = js2jeon(code, { iife: true })
    console.log('JEON:', JSON.stringify(jeon, null, 2))

    // Provide jsx function in context
    const result = evalJeon(jeon, { jsx })
    console.log('Final Result:', JSON.stringify(result, null, 2))
} catch (error: any) {
    console.error('Error:', error.message)
    console.error(error.stack)
}