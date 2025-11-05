import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitParenthesizedExpression(node: acorn.Node & { expression: acorn.Node }, options?: { json?: typeof JSON }): any {
    return {
        '(': ast2jeon(node.expression, options)
    }
}