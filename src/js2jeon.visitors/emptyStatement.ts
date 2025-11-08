import * as acorn from 'acorn'

export function visitEmptyStatement(node: acorn.EmptyStatement, options?: { json?: typeof JSON }): any {
    // Return ';' for empty statements instead of '[EmptyStatement]'
    return ';'
}