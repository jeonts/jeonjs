import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitMemberExpression(node: acorn.MemberExpression, options?: { json?: typeof JSON }): any {
    // Handle property chaining
    const segments = []
    let current = node as acorn.MemberExpression

    // Collect all segments
    while (current && current.type === 'MemberExpression') {
        if (current.computed) {
            segments.unshift(ast2jeon(current.property, options))
        } else {
            segments.unshift(
                current.property.type === 'Identifier'
                    ? (current.property as acorn.Identifier).name
                    : ''
            )
        }
        current = current.object as acorn.MemberExpression
    }

    // Add the base object
    segments.unshift(ast2jeon(current, options))

    return {
        '.': segments
    }
}