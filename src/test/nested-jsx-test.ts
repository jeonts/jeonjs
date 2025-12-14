import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

// Mock jsx function that produces the desired output format
function jsx(tag: string, props: any) {
    // Convert children array to nested jsx calls if needed
    let childrenStr = ''
    if (props.children) {
        if (Array.isArray(props.children)) {
            const childrenCalls = props.children.map((child: any) => {
                if (child && typeof child === 'object' && child.type === 'jsx') {
                    // Recursively build jsx call string
                    return `jsx('${child.tag}', ${JSON.stringify(child.props)})`
                } else {
                    return JSON.stringify(child)
                }
            })
            childrenStr = `[${childrenCalls.join(', ')}]`
        } else {
            childrenStr = JSON.stringify(props.children)
        }
    }

    // Build the props object string without children for cleaner output
    const propsWithoutChildren: Record<string, any> = {}
    for (const key in props) {
        if (key !== 'children') {
            propsWithoutChildren[key] = props[key]
        }
    }

    let propsStr = JSON.stringify(propsWithoutChildren)
    if (props.children) {
        // Add children back in
        if (propsStr === '{}') {
            propsStr = `{children:${childrenStr}}`
        } else {
            // Remove closing brace and add children
            propsStr = propsStr.substring(0, propsStr.length - 1) + `,children:${childrenStr}}`
        }
    }

    // Return string representation of the jsx call
    return `jsx('${tag}', ${propsStr})`
}

const code = `<div className="container">
  <h1>Hello World</h1>
  <p>
    <span>Some text</span>
  </p>
</div>`

console.log('Code:', code)

try {
    const jeon = js2jeon(code, { iife: true })
    console.log('JEON:', JSON.stringify(jeon, null, 2))

    // Provide jsx function in context
    const result = evalJeon(jeon, { jsx })
    console.log('Result:', result)
} catch (error: any) {
    console.error('Error:', error.message)
    console.error(error.stack)
}