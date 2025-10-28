import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitAssignmentExpression(node: acorn.AssignmentExpression, options?: { json?: typeof JSON }): any {
    if (node.operator === '=') {
        // Check if this is destructuring assignment
        if (node.left.type === 'ArrayPattern' || node.left.type === 'ObjectPattern') {
            return {
                '=': [
                    `[${node.left.type}]`,
                    ast2jeon(node.right, options)
                ]
            }
        }
        return {
            '=': [
                ast2jeon(node.left, options),
                ast2jeon(node.right, options)
            ]
        }
    }
    // Handle other assignment operators
    return {
        [node.operator]: [
            ast2jeon(node.left, options),
            ast2jeon(node.right, options)
        ]
    }
}