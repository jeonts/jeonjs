import * as acorn from 'acorn'

export function visitIdentifier(node: acorn.Identifier, options?: { json?: typeof JSON }): any {
    return `@${node.name}`
}