import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitCallExpression(node: acorn.CallExpression, options?: { json?: typeof JSON }): any {
    // Check if it's a method call or function call
    if (node.callee.type === 'MemberExpression') {
        // Method call - convert to JEON function execution format
        const callee = node.callee as acorn.MemberExpression
        return {
            '()': [
                {
                    '.': [
                        ast2jeon(callee.object, options),
                        callee.property.type === 'Identifier'
                            ? (callee.property as acorn.Identifier).name
                            : ''
                    ]
                },
                ...node.arguments.map(arg => ast2jeon(arg, options))
            ]
        }
    } else {
        // Function call - use explicit () operator syntax (no sugar)
        const functionName = (node.callee as acorn.Identifier).name
        return {
            '()': [
                `@${functionName}`,
                ...node.arguments.map(arg => ast2jeon(arg, options))
            ]
        }
    }
}