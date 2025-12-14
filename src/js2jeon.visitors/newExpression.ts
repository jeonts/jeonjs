import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitNewExpression(node: acorn.NewExpression, options?: { json?: typeof JSON }): any {
    // Handle the callee properly - it might be an identifier, a class expression, or other expression types
    let calleeExpression: any

    // If the callee is a parenthesized expression, get the inner expression
    if (node.callee.type === 'ParenthesizedExpression') {
        calleeExpression = (node.callee as any).expression
    } else {
        calleeExpression = node.callee
    }

    return {
        'new': [
            ast2jeon(calleeExpression, options),
            ...node.arguments.map(arg => ast2jeon(arg, options))
        ]
    }
}