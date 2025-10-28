import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitLogicalExpression(node: acorn.LogicalExpression, options?: { json?: typeof JSON }): any {
    return {
        [node.operator]: [
            ast2jeon(node.left, options),
            ast2jeon(node.right, options)
        ]
    }
}