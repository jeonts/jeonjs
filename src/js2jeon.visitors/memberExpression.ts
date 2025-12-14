import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitMemberExpression(node: acorn.MemberExpression, options?: { json?: typeof JSON }): any {
    // Check if this is a computed member expression (bracket notation)
    if (node.computed) {
        // For computed properties, use the [] operator
        return {
            '[]': [
                ast2jeon(node.object, options),
                ast2jeon(node.property, options)
            ]
        }
    }

    // Handle dot notation property chaining
    const segments = []
    let current = node as acorn.MemberExpression

    // Collect all segments for dot notation
    while (current && current.type === 'MemberExpression' && !current.computed) {
        // For dot notation, property names are literal strings
        if (current.property.type === 'Identifier') {
            segments.unshift((current.property as acorn.Identifier).name)
        } else {
            segments.unshift(ast2jeon(current.property, options))
        }
        current = current.object as acorn.MemberExpression
    }

    // Add the base object
    segments.unshift(ast2jeon(current, options))

    return {
        '.': segments
    }
}