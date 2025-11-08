import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

// This visitor is no longer used since variable declarations are handled in the Program visitor
// to group consecutive declarations of the same kind.
export function visitVariableDeclaration(node: acorn.VariableDeclaration, options?: { json?: typeof JSON }): any {
    // Use different keys based on declaration kind
    // Treat var the same as let for simplicity
    const key = (node as acorn.VariableDeclaration).kind === 'const' ? '@@' : '@'
    const declarations: Record<string, any> = {}
    for (const decl of node.declarations) {
        if (decl.id.type === 'Identifier') {
            declarations[(decl.id as acorn.Identifier).name] = decl.init ? ast2jeon(decl.init, options) : '__undefined__'
        }
    }
    return {
        [key]: declarations
    }
}