import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitConditionalExpression(node: acorn.ConditionalExpression, options?: { json?: typeof JSON }): any {
    return {
        '?': [
            ast2jeon(node.test, options),
            ast2jeon(node.consequent, options),
            ast2jeon(node.alternate, options)
        ]
    }
}