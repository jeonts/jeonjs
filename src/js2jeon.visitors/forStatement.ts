import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitForStatement(node: acorn.ForStatement, options?: { json?: typeof JSON }): any {
    return {
        'for': [
            node.init ? ast2jeon(node.init, options) : null,
            node.test ? ast2jeon(node.test, options) : null,
            node.update ? ast2jeon(node.update, options) : null,
            ast2jeon(node.body, options)
        ]
    }
}