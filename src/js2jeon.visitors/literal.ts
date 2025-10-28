import * as acorn from 'acorn'

export function visitLiteral(node: acorn.Literal, options?: { json?: typeof JSON }): any {
    return node.value
}