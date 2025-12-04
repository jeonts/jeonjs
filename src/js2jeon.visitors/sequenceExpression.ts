import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitSequenceExpression(node: acorn.SequenceExpression, options?: { json?: typeof JSON }): any {
    // Handle sequence expressions (comma operator) by converting to a JEON array
    // Each expression in the sequence is converted separately
    return {
        ',': node.expressions.map(expr => ast2jeon(expr, options))
    }
}