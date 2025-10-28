import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitNewExpression(node: acorn.NewExpression, options?: { json?: typeof JSON }): any {
    return {
        'new': [
            (node.callee as acorn.Identifier).name,
            ...node.arguments.map(arg => ast2jeon(arg, options))
        ]
    }
}