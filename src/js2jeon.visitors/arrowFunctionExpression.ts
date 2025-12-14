import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitArrowFunctionExpression(node: acorn.ArrowFunctionExpression, options?: { json?: typeof JSON }): any {
    // Extract parameter names
    const params = node.params.map((param: acorn.Node) => {
        if (param.type === 'Identifier') {
            return (param as acorn.Identifier).name
        }
        return ast2jeon(param, options)
    })

    // Create the parameter string for the key
    const paramString = params.length > 0 ? `(${params.join(', ')})` : '()'

    // For arrow functions, the correct structure is:
    // { "(param1, param2) =>": body }
    return {
        [`${paramString} =>`]: ast2jeon(node.body, options)
    }
}