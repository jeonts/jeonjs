import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitAwaitExpression(node: acorn.AwaitExpression, options?: { json?: typeof JSON }): any {
    return {
        'await': ast2jeon(node.argument, options)
    }
}