import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitYieldExpression(node: acorn.YieldExpression, options?: { json?: typeof JSON }): any {
    if (node.delegate) {
        return {
            'yield*': node.argument ? ast2jeon(node.argument, options) : null
        }
    } else {
        return {
            'yield': node.argument ? ast2jeon(node.argument, options) : null
        }
    }
}