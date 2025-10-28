import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitArrayExpression(node: acorn.ArrayExpression, options?: { json?: typeof JSON }): any {
    return node.elements
        .filter(element => element !== null)
        .map(element => ast2jeon(element!, options))
}