import * as acorn from 'acorn'

export function visitThisExpression(node: acorn.ThisExpression, options?: { json?: typeof JSON }): any {
    return '@this'
}