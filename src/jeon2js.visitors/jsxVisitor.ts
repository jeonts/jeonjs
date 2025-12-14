/**
 * Handles JSX conversion in JEON to JavaScript
 * @param keys The keys of the JEON object
 * @param jeon The JEON object containing JSX
 * @param visit The visitor function to process nested elements
 * @param jsonImpl The JSON implementation to use (JSON or JSON5)
 * @param useJsxFunction Whether to produce jsx() function calls instead of JSX syntax (default: false)
 */
export function visitJSX(keys: string[], jeon: any, visit: (item: any) => string, jsonImpl?: typeof JSON, useJsxFunction: boolean = false): string | null {
    // Handle component structures (<Tag>)
    const componentKey = keys.find(key => key.startsWith('<') && key.endsWith('>'))
    if (componentKey) {
        // This is a JSX-like component structure
        const tag = componentKey.substring(1, componentKey.length - 1)
        const props = jeon[componentKey]
        const children = props.children || []

        if (useJsxFunction) {
            // Generate jsx() function call
            const processedProps: Record<string, any> = {}

            // Process all props except children
            for (const [key, value] of Object.entries(props)) {
                if (key !== 'children') {
                    processedProps[key] = value
                }
            }

            // Process children
            if (children.length > 0) {
                const processedChildren = children.map((child: any) => {
                    if (typeof child === 'string') {
                        return child
                    }
                    // For JSX elements, convert them recursively
                    if (typeof child === 'object' && child !== null) {
                        const childKeys = Object.keys(child)
                        if (childKeys.length === 1 && childKeys[0].startsWith('<') && childKeys[0].endsWith('>')) {
                            // This is a JSX element, convert it to jsx() call
                            return visit(child)
                        }
                    }
                    // For other expressions, visit them
                    return visit(child)
                })

                if (processedChildren.length === 1) {
                    processedProps.children = processedChildren[0]
                } else {
                    processedProps.children = processedChildren
                }
            }

            // Build the props string manually to handle jsx() calls correctly
            const propStrings: string[] = []
            for (const [key, value] of Object.entries(processedProps)) {
                if (key === 'children') {
                    // Handle children specially
                    if (typeof value === 'string' && value.includes('jsx(')) {
                        // Single jsx() call child
                        propStrings.push(`${key}: ${value}`)
                    } else if (Array.isArray(value)) {
                        // Array of children
                        const childrenArrayItems = value.map((child: any) => {
                            if (typeof child === 'string' && child.includes('jsx(')) {
                                return child // jsx() call
                            }
                            return jsonImpl ? jsonImpl.stringify(child) : JSON.stringify(child) // Other values
                        })
                        propStrings.push(`${key}: [${childrenArrayItems.join(', ')}]`)
                    } else {
                        // Other child value
                        propStrings.push(`${key}: ${jsonImpl ? jsonImpl.stringify(value) : JSON.stringify(value)}`)
                    }
                } else {
                    // Regular prop
                    propStrings.push(`${key}: ${jsonImpl ? jsonImpl.stringify(value) : JSON.stringify(value)}`)
                }
            }

            const propsString = propStrings.length > 0 ? `{${propStrings.join(', ')}}` : '{}'
            return `jsx('${tag}', ${propsString})`
        } else {
            // Generate proper JSX syntax (default behavior)
            const propEntries = Object.entries(props)
                .filter(([key]) => key !== 'children')
                .map(([key, value]) => {
                    const valueStr = visit(value)
                    // For string values, we don't need quotes in JSX
                    if (typeof value === 'string') {
                        return `${key}="${value}"`
                    }
                    return `${key}={${valueStr}}`
                })

            const propsStr = propEntries.length > 0 ? ' ' + propEntries.join(' ') : ''

            // Generate children string
            if (children.length > 0) {
                const childrenStr = children.map((child: any) => {
                    if (typeof child === 'string') {
                        return child
                    }
                    // For JSX elements, don't wrap in curly braces
                    if (typeof child === 'object' && child !== null) {
                        const childKeys = Object.keys(child)
                        if (childKeys.length === 1 && childKeys[0].startsWith('<') && childKeys[0].endsWith('>')) {
                            // This is a JSX element, convert it directly
                            return visit(child)
                        }
                    }
                    // For other expressions, wrap in curly braces
                    return `{${visit(child)}}`
                }).join('')

                // Format with newlines and indentation if there are child elements
                if (children.some((child: any) => typeof child === 'object')) {
                    // If children contain JSX elements, format with newlines
                    const formattedChildren = children.map((child: any) => {
                        if (typeof child === 'string') {
                            return child
                        }
                        if (typeof child === 'object' && child !== null) {
                            const childKeys = Object.keys(child)
                            if (childKeys.length === 1 && childKeys[0].startsWith('<') && childKeys[0].endsWith('>')) {
                                // Indent JSX elements
                                return '\n  ' + visit(child).replace(/\n/g, '\n  ')
                            }
                        }
                        return `{${visit(child)}}`
                    }).join('')
                    return `<${tag}${propsStr}>${formattedChildren}\n</${tag}>`
                } else {
                    // Simple text children
                    return `<${tag}${propsStr}>${childrenStr}</${tag}>`
                }
            } else {
                return `<${tag}${propsStr} />`
            }
        }
    }
    return null
}