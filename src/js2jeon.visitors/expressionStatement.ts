import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitExpressionStatement(node: acorn.ExpressionStatement, options?: { json?: typeof JSON }): any {
    return ast2jeon(node.expression, options)
}