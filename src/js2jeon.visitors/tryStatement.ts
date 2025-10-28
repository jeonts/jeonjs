import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitTryStatement(node: acorn.TryStatement, options?: { json?: typeof JSON }): any {
    const tryResult: any = {
        'try': {
            'body': Array.isArray(node.block.body) ?
                node.block.body.map(stmt => ast2jeon(stmt, options)) :
                [ast2jeon(node.block.body[0], options)]
        }
    }
    if (node.handler) {
        tryResult.try.catch = {
            'param': node.handler.param ?
                (node.handler.param as acorn.Identifier).name :
                'error',
            'body': Array.isArray(node.handler.body.body) ?
                node.handler.body.body.map(stmt => ast2jeon(stmt, options)) :
                [ast2jeon(node.handler.body.body[0], options)]
        }
    }
    if (node.finalizer) {
        tryResult.try.finally = Array.isArray(node.finalizer.body) ?
            node.finalizer.body.map(stmt => ast2jeon(stmt, options)) :
            [ast2jeon(node.finalizer.body[0], options)]
    }
    return tryResult
}