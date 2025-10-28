import * as acorn from 'acorn'

export function visitBreakStatement(node: acorn.BreakStatement, options?: { json?: typeof JSON }): any {
    return {
        'break': node.label ?
            node.label.name :
            null
    }
}