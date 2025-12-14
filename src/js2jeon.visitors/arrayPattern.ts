import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitArrayPattern(node: acorn.ArrayPattern, options?: { json?: typeof JSON }): any {
    // Create a special marker for array destructuring patterns
    // We'll store the elements with their positions as keys
    const elements: Record<string, any> = {}

    for (let i = 0; i < node.elements.length; i++) {
        const element = node.elements[i]
        if (element) {
            if (element.type === 'Identifier') {
                // Simple identifier like 'a' in [a, b]
                elements[i.toString()] = `@${(element as acorn.Identifier).name}`
            } else if (element.type === 'RestElement') {
                // Rest element like '...rest' in [a, b, ...rest]
                const arg = (element as any).argument
                if (arg && arg.type === 'Identifier') {
                    elements[`...${i}`] = `@${arg.name}`
                }
            } else if (element.type === 'ArrayPattern') {
                // Nested array pattern like [[a, b]] in [c, [a, b]]
                elements[`[${i}]`] = visitArrayPattern(element as acorn.ArrayPattern, options)
            } else if (element.type === 'ObjectPattern') {
                // Nested object pattern like [{a, b}] in [c, {a, b}]
                // For now, we'll use a placeholder - in a full implementation we'd need to handle this properly
                elements[`{${i}}`] = `[ObjectPattern]`
            } else {
                // Other patterns - convert normally
                elements[i.toString()] = ast2jeon(element, options)
            }
        } else {
            // Empty slot like [,] in [a,,b]
            elements[i.toString()] = null
        }
    }

    return {
        '[ArrayPattern]': elements
    }
}