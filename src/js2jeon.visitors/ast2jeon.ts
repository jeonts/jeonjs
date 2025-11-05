import * as acorn from 'acorn'
import { visitorRegistry } from './registry'

/**
 * Converts an AST node to JEON format
 * @param node The AST node to convert
 * @param options Conversion options
 * @param options.json The JSON implementation to use (JSON or JSON5)
 */
export function ast2jeon(node: acorn.Node, options?: { json?: typeof JSON }): any {
    if (!node) return null

    // Check if we have a visitor for this node type
    const visitor = visitorRegistry[node.type]
    if (visitor) {
        // For visitors that support options, pass them
        // Note: This would require updating all visitor functions to accept options
        return visitor(node, options)
    }

    // Fallback to the original switch statement for unimplemented visitors
    switch (node.type) {
        case 'ArrayExpression':
            return (node as acorn.ArrayExpression).elements
                .filter(element => element !== null)
                .map(element => ast2jeon(element!, options))

        case 'ExpressionStatement':
            return ast2jeon((node as acorn.ExpressionStatement).expression, options)

        case 'LogicalExpression':
            return {
                [(node as acorn.LogicalExpression).operator]: [
                    ast2jeon((node as acorn.LogicalExpression).left, options),
                    ast2jeon((node as acorn.LogicalExpression).right, options)
                ]
            }

        case 'ConditionalExpression':
            return {
                '?': [
                    ast2jeon((node as acorn.ConditionalExpression).test, options),
                    ast2jeon((node as acorn.ConditionalExpression).consequent, options),
                    ast2jeon((node as acorn.ConditionalExpression).alternate, options)
                ]
            }

        case 'CallExpression':
            // Check if it's a method call or function call
            if ((node as acorn.CallExpression).callee.type === 'MemberExpression') {
                // Method call - convert to JEON function execution format
                const callee = (node as acorn.CallExpression).callee as acorn.MemberExpression
                return {
                    '()': [
                        {
                            '.': [
                                ast2jeon(callee.object, options),
                                callee.property.type === 'Identifier'
                                    ? (callee.property as acorn.Identifier).name
                                    : ''
                            ]
                        },
                        ...(node as acorn.CallExpression).arguments.map(arg => ast2jeon(arg, options))
                    ]
                }
            } else {
                // Function call
                const functionName = ((node as acorn.CallExpression).callee as acorn.Identifier).name
                return {
                    [`${functionName}()`]: (node as acorn.CallExpression).arguments.map(arg => ast2jeon(arg, options))
                }
            }

        case 'NewExpression':
            return {
                'new': [
                    ((node as acorn.NewExpression).callee as acorn.Identifier).name,
                    ...(node as acorn.NewExpression).arguments.map(arg => ast2jeon(arg, options))
                ]
            }

        case 'MemberExpression':
            // Handle property chaining
            const segments = []
            let current = node as acorn.MemberExpression

            // Collect all segments
            while (current && current.type === 'MemberExpression') {
                if (current.computed) {
                    segments.unshift(ast2jeon(current.property, options))
                } else {
                    segments.unshift(
                        current.property.type === 'Identifier'
                            ? (current.property as acorn.Identifier).name
                            : ''
                    )
                }
                current = current.object as acorn.MemberExpression
            }

            // Add the base object
            segments.unshift(ast2jeon(current, options))

            return {
                '.': segments
            }

        case 'SpreadElement':
            return {
                '...': ast2jeon((node as acorn.SpreadElement).argument, options)
            }

        case 'FunctionDeclaration':
        case 'FunctionExpression':
        case 'ArrowFunctionExpression':
            const funcNode = node as acorn.Function
            const params = funcNode.params.map((param: acorn.Node) => {
                if (param.type === 'Identifier') {
                    return (param as acorn.Identifier).name
                }
                return ast2jeon(param, options)
            })

            // Handle async functions
            const isAsync = funcNode.async ? 'async ' : ''

            // Handle generator functions
            const isGenerator = funcNode.generator ? '*' : ''

            if (node.type === 'ArrowFunctionExpression') {
                const paramStr = params.length > 0 ? `(${params.join(', ')})` : '()'
                const prefix = funcNode.async ? 'async ' : ''
                return {
                    [`${prefix}${paramStr} =>`]: ast2jeon(funcNode.body, options)
                }
            } else {
                const functionName = funcNode.id ? ` ${(funcNode.id as acorn.Identifier).name}` : ''
                const paramStr = params.length > 0 ? `(${params.join(', ')})` : '()'
                const functionType = isAsync ? `${isAsync}function${isGenerator}` : `function${isGenerator}`
                // For function body, we need to check if it's a BlockStatement
                if (funcNode.body.type === 'BlockStatement') {
                    const blockBody = funcNode.body as acorn.BlockStatement
                    return {
                        [`${functionType}${functionName}${paramStr}`]: Array.isArray(blockBody.body) ?
                            blockBody.body.map(stmt => ast2jeon(stmt, options)) :
                            [ast2jeon(blockBody.body[0], options)]
                    }
                } else {
                    return {
                        [`${functionType}${functionName}${paramStr}`]: [ast2jeon(funcNode.body, options)]
                    }
                }
            }

        case 'BlockStatement':
            if ((node as acorn.BlockStatement).body.length === 1) {
                return ast2jeon((node as acorn.BlockStatement).body[0], options)
            }
            return (node as acorn.BlockStatement).body.map(stmt => ast2jeon(stmt, options))

        case 'VariableDeclaration':
            // Use different keys based on declaration kind
            const key = (node as acorn.VariableDeclaration).kind === 'const' ? '@@' : '@'
            const declarations: Record<string, any> = {}
            for (const decl of (node as acorn.VariableDeclaration).declarations) {
                if (decl.id.type === 'Identifier') {
                    declarations[(decl.id as acorn.Identifier).name] = decl.init ? ast2jeon(decl.init, options) : null
                }
            }
            return {
                [key]: declarations
            }

        case 'AssignmentExpression':
            if ((node as acorn.AssignmentExpression).operator === '=') {
                // Check if this is destructuring assignment
                if ((node as acorn.AssignmentExpression).left.type === 'ArrayPattern' || (node as acorn.AssignmentExpression).left.type === 'ObjectPattern') {
                    return {
                        '=': [
                            `[${(node as acorn.AssignmentExpression).left.type}]`,
                            ast2jeon((node as acorn.AssignmentExpression).right, options)
                        ]
                    }
                }
                return {
                    '=': [
                        ast2jeon((node as acorn.AssignmentExpression).left, options),
                        ast2jeon((node as acorn.AssignmentExpression).right, options)
                    ]
                }
            }
            // Handle other assignment operators
            return {
                [(node as acorn.AssignmentExpression).operator]: [
                    ast2jeon((node as acorn.AssignmentExpression).left, options),
                    ast2jeon((node as acorn.AssignmentExpression).right, options)
                ]
            }

        case 'UpdateExpression':
            return {
                [(node as acorn.UpdateExpression).operator]: ast2jeon((node as acorn.UpdateExpression).argument, options)
            }

        case 'UnaryExpression':
            return {
                [(node as acorn.UnaryExpression).operator]: ast2jeon((node as acorn.UnaryExpression).argument, options)
            }

        case 'BinaryExpression':
            return {
                [(node as acorn.BinaryExpression).operator]: [
                    ast2jeon((node as acorn.BinaryExpression).left, options),
                    ast2jeon((node as acorn.BinaryExpression).right, options)
                ]
            }

        case 'IfStatement':
            const ifStmt = node as acorn.IfStatement
            const result: any = {
                'if': [
                    ast2jeon(ifStmt.test, options),
                    ast2jeon(ifStmt.consequent, options)
                ]
            }
            if (ifStmt.alternate) {
                result['if'][2] = ast2jeon(ifStmt.alternate, options)
            }
            return result

        case 'WhileStatement':
            return {
                'while': [
                    ast2jeon((node as acorn.WhileStatement).test, options),
                    ast2jeon((node as acorn.WhileStatement).body, options)
                ]
            }

        case 'ForStatement':
            const forStmt = node as acorn.ForStatement
            return {
                'for': [
                    forStmt.init ? ast2jeon(forStmt.init, options) : null,
                    forStmt.test ? ast2jeon(forStmt.test, options) : null,
                    forStmt.update ? ast2jeon(forStmt.update, options) : null,
                    ast2jeon(forStmt.body, options)
                ]
            }

        case 'ReturnStatement':
            return {
                'return': (node as acorn.ReturnStatement).argument ?
                    ast2jeon((node as acorn.ReturnStatement).argument!, options) :
                    null
            }

        case 'Identifier':
            return `@${(node as acorn.Identifier).name}`

        case 'Literal':
            return (node as acorn.Literal).value

        case 'ThisExpression':
            return '@this'

        case 'AwaitExpression':
            return {
                'await': ast2jeon((node as acorn.AwaitExpression).argument, options)
            }

        case 'YieldExpression':
            const yieldExpr = node as acorn.YieldExpression
            if (yieldExpr.delegate) {
                return {
                    'yield*': yieldExpr.argument ? ast2jeon(yieldExpr.argument, options) : null
                }
            } else {
                return {
                    'yield': yieldExpr.argument ? ast2jeon(yieldExpr.argument, options) : null
                }
            }

        case 'BreakStatement':
            return {
                'break': (node as acorn.BreakStatement).label ?
                    (node as acorn.BreakStatement).label!.name :
                    null
            }

        case 'ContinueStatement':
            return {
                'continue': (node as acorn.ContinueStatement).label ?
                    (node as acorn.ContinueStatement).label!.name :
                    null
            }

        case 'SwitchStatement':
            const switchStmt = node as acorn.SwitchStatement
            const cases = switchStmt.cases.map(caseClause => {
                if (caseClause.test) {
                    return {
                        'case': ast2jeon(caseClause.test, options),
                        'body': caseClause.consequent.map(consequent => ast2jeon(consequent, options))
                    }
                } else {
                    return {
                        'default': caseClause.consequent.map(consequent => ast2jeon(consequent, options))
                    }
                }
            })
            return {
                'switch': [
                    ast2jeon(switchStmt.discriminant, options),
                    cases
                ]
            }

        case 'TryStatement':
            const tryStmt = node as acorn.TryStatement
            const tryResult: any = {
                'try': {
                    'body': Array.isArray(tryStmt.block.body) ?
                        tryStmt.block.body.map(stmt => ast2jeon(stmt, options)) :
                        [ast2jeon(tryStmt.block.body[0], options)]
                }
            }
            if (tryStmt.handler) {
                tryResult.try.catch = {
                    'param': tryStmt.handler.param ?
                        (tryStmt.handler.param as acorn.Identifier).name :
                        'error',
                    'body': Array.isArray(tryStmt.handler.body.body) ?
                        tryStmt.handler.body.body.map(stmt => ast2jeon(stmt, options)) :
                        [ast2jeon(tryStmt.handler.body.body[0], options)]
                }
            }
            if (tryStmt.finalizer) {
                tryResult.try.finally = Array.isArray(tryStmt.finalizer.body) ?
                    tryStmt.finalizer.body.map(stmt => ast2jeon(stmt, options)) :
                    [ast2jeon(tryStmt.finalizer.body[0], options)]
            }
            return tryResult

        case 'ThrowStatement':
            return {
                'throw': ast2jeon((node as acorn.ThrowStatement).argument, options)
            }

        case 'Program':
            if ((node as acorn.Program).body.length === 1) {
                return ast2jeon((node as acorn.Program).body[0], options)
            }
            return (node as acorn.Program).body.map(stmt => ast2jeon(stmt, options))

        default:
            // For unhandled node types, return a placeholder
            return `[${node.type}]`
    }
}