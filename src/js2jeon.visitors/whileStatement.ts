import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitWhileStatement(node: acorn.WhileStatement, options?: { json?: typeof JSON }): any {
    return {
        'while': [
            ast2jeon(node.test, options),
            ast2jeon(node.body, options)
        ]
    }
}