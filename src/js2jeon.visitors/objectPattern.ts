import * as acorn from 'acorn'

export function visitObjectPattern(node: acorn.ObjectPattern, options?: { json?: typeof JSON }): any {
    return `[ObjectPattern]`
}