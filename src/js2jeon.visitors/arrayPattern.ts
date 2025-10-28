import * as acorn from 'acorn'

export function visitArrayPattern(node: acorn.ArrayPattern, options?: { json?: typeof JSON }): any {
    return `[ArrayPattern]`
}