import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitUnaryExpression(node: acorn.UnaryExpression, options?: { json?: typeof JSON }): any {
    return {
        [node.operator]: ast2jeon(node.argument, options)
    }
}