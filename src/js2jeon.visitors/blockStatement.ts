import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitBlockStatement(node: acorn.BlockStatement, options?: { json?: typeof JSON }): any {
    if (node.body.length === 1) {
        return ast2jeon(node.body[0], options)
    }
    return node.body.map(stmt => ast2jeon(stmt, options))
}
