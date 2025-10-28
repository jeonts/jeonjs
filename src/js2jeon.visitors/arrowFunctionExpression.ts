import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitArrowFunctionExpression(node: acorn.ArrowFunctionExpression, options?: { json?: typeof JSON }): any {
    const params = node.params.map((param: acorn.Node) => {
        if (param.type === 'Identifier') {
            return (param as acorn.Identifier).name
        }
        return ast2jeon(param, options)
    })

    const paramStr = params.length > 0 ? `(${params.join(', ')})` : '()'
    const prefix = node.async ? 'async ' : ''
    return {
        [`${prefix}${paramStr} =>`]: ast2jeon(node.body, options)
    }
}