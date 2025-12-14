import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

// Mock jsx function that produces the exact format requested
function jsx(tag: string, props: any) {
    // This is a simplified version that shows the structure
    // In a real implementation, this would create actual JSX elements
    return {
        _call: `jsx('${tag}', ${JSON.stringify(props)})`,
        tag,
        props
    }
}

const code = `<div className="container">
  <h1>Hello World</h1>
</div>`

console.log('Code:', code)
console.log('\nExpected format: jsx(\'div\', {children:jsx(...nested jsx call), className:\'container\'})')

try {
    const jeon = js2jeon(code, { iife: true })
    console.log('\nJEON:', JSON.stringify(jeon, null, 2))

    // Provide jsx function in context to get the proper format
    const result = evalJeon(jeon, { jsx })
    console.log('\nActual result:')
    console.log('Tag:', result.tag)
    console.log('Props:', JSON.stringify(result.props, null, 2))
    console.log('Formatted call:', result._call)

    // Show the nested structure
    if (result.props.children && Array.isArray(result.props.children)) {
        console.log('\nChildren breakdown:')
        result.props.children.forEach((child: any, index: number) => {
            if (child && typeof child === 'object' && child._call) {
                console.log(`  Child ${index}: ${child._call}`)
            } else {
                console.log(`  Child ${index}: ${JSON.stringify(child)}`)
            }
        })
    }
} catch (error: any) {
    console.error('Error:', error.message)
    console.error(error.stack)
}