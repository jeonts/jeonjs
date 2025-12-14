import { evalJeon } from '../safeEval'

// Handle JSX operator for JSX elements
export function evaluateJSX(operands: any, context: Record<string, any>): any {
    if (typeof operands === 'object' && operands !== null) {
        // Get the tag name (key that starts with '<' and ends with '>')
        const tagKey = Object.keys(operands).find(key => key.startsWith('<') && key.endsWith('>'))

        if (tagKey) {
            const tagName = tagKey.substring(1, tagKey.length - 1) // Remove < and >
            const props = operands[tagKey]

            // Process props
            const processedProps: Record<string, any> = {}
            for (const [key, value] of Object.entries(props)) {
                if (key === 'children' && Array.isArray(value)) {
                    // Handle children specially - process each child individually but keep as array
                    processedProps[key] = value.map((child: any) => {
                        // If the child is a JSX element object, recursively process it
                        if (typeof child === 'object' && child !== null) {
                            const childKeys = Object.keys(child)
                            const jsxChildKey = childKeys.find(key => key.startsWith('<') && key.endsWith('>'))
                            if (jsxChildKey) {
                                // This is a JSX element, recursively evaluate it
                                return evalJeon(child, context)
                            }
                        }
                        // For non-JSX children, evaluate normally
                        return evalJeon(child, context)
                    })
                } else {
                    // Process other props normally
                    processedProps[key] = evalJeon(value, context)
                }
            }

            // Get the jsx function from context or safeContext
            const jsxFunction = context.jsx || (typeof global !== 'undefined' ? (global as any).jsx : undefined)

            // If jsx function is available, call it, otherwise return object representation
            if (typeof jsxFunction === 'function') {
                return jsxFunction(tagName, processedProps)
            } else {
                // Fallback - return object representation
                return {
                    __jsx: true,
                    type: tagName,
                    props: processedProps
                }
            }
        }
    }

    // Fallback - return operands as is
    return operands
}