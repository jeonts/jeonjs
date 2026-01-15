import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitFunctionExpression(node: acorn.FunctionExpression, options?: { json?: typeof JSON }): any {
    const params = node.params.map((param: acorn.Node) => {
        if (param.type === 'Identifier') {
            return (param as acorn.Identifier).name
        }
        else if (param.type ==="RestElement"){
            return "..." + param.argument.name
        }
        return ast2jeon(param, options)
    })

    // Handle async functions
    const isAsync = node.async ? 'async ' : ''

    // Handle generator functions
    const isGenerator = node.generator ? '*' : ''

    const functionName = node.id ? ` ${(node.id as acorn.Identifier).name}` : ''
    const paramStr = params.length > 0 ? `(${params.join(', ')})` : '()'
    const functionType = isAsync ? `${isAsync}function${isGenerator}` : `function${isGenerator}`
    // For function body, we need to check if it's a BlockStatement
    if (node.body.type === 'BlockStatement') {
        const blockBody = node.body as acorn.BlockStatement
        return {
            [`${functionType}${functionName}${paramStr}`]: Array.isArray(blockBody.body) ?
                blockBody.body.map((stmt: any) => ast2jeon(stmt, options)) :
                [ast2jeon(blockBody.body[0], options)]
        }
    } else {
        return {
            [`${functionType}${functionName}${paramStr}`]: [ast2jeon(node.body, options)]
        }
    }
}