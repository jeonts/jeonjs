import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitReturnStatement(node: acorn.ReturnStatement, options?: { json?: typeof JSON }): any {
    return {
        'return': node.argument ?
            ast2jeon(node.argument, options) :
            null
    }
}