import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitBinaryExpression(node: acorn.BinaryExpression, options?: { json?: typeof JSON }): any {
    return {
        [node.operator]: [
            ast2jeon(node.left, options),
            ast2jeon(node.right, options)
        ]
    }
}