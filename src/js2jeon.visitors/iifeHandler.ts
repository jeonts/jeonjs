import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

/**
 * Handles IIFE (Immediately Invoked Function Expression) transformations
 * @param node The AST node to process
 * @param options Conversion options
 * @returns JEON representation with proper IIFE handling
 */
export function visitIIFE(node: acorn.Node, options?: { json?: typeof JSON, iife?: boolean }): any {
    // If iife option is not enabled, just convert normally
    if (!options?.iife) {
        return ast2jeon(node, options)
    }

    // Handle different node types that might need IIFE wrapping
    switch (node.type) {
        case 'Program':
            return handleProgramIIFE(node as acorn.Program, options)

        case 'BlockStatement':
            return handleBlockIIFE(node as acorn.BlockStatement, options)

        case 'ExpressionStatement':
            return handleExpressionIIFE((node as acorn.ExpressionStatement).expression, options)

        default:
            return ast2jeon(node, options)
    }
}

/**
 * Handle IIFE logic for Program nodes
 */
function handleProgramIIFE(node: acorn.Program, options?: { json?: typeof JSON, iife?: boolean }): any {
    // If there's only one statement, handle it specially
    if (node.body.length === 1) {
        const firstStatement = node.body[0]

        // If it's an expression statement, we might need to wrap it
        if (firstStatement.type === 'ExpressionStatement') {
            const expression = firstStatement.expression

            // Handle different expression types
            switch (expression.type) {
                case 'ObjectExpression':
                    // Wrap object literals in parentheses
                    return {
                        '(': ast2jeon(expression, options)
                    }

                case 'ArrayExpression':
                    // Wrap array literals in parentheses
                    return {
                        '(': ast2jeon(expression, options)
                    }

                case 'ClassExpression':
                    // Wrap class expressions in parentheses
                    return {
                        '(': ast2jeon(expression, options)
                    }

                default:
                    // For other expressions, convert normally
                    return ast2jeon(firstStatement, options)
            }
        }
        // For block statements, handle the last statement
        else if (firstStatement.type === 'BlockStatement') {
            return handleBlockIIFE(firstStatement, options)
        }
        // For other statement types, convert normally
        else {
            return ast2jeon(firstStatement, options)
        }
    }
    // For multiple statements, we want to return the value of the last statement
    else if (node.body.length > 1) {
        return handleMultipleStatementsIIFE(node.body, options)
    }

    // Default conversion
    return ast2jeon(node, options)
}

/**
 * Handle IIFE logic for BlockStatement nodes
 */
function handleBlockIIFE(node: acorn.BlockStatement, options?: { json?: typeof JSON, iife?: boolean }): any {
    // If block is not empty
    if (node.body.length > 0) {
        // Get the last statement
        const lastStatement = node.body[node.body.length - 1]

        // If the last statement is a return statement, wrap the entire block in an IIFE
        if (lastStatement.type === 'ReturnStatement') {
            // For blocks ending with return statements, create a function that executes the block and returns the result
            // This creates the structure: { '(': { '()': [ { "() =>": { block } }, [] ] } }
            return {
                '(': {
                    '()': [
                        {
                            "() =>": ast2jeon(node, options) // Body with no parameters
                        },
                        [] // No arguments
                    ]
                }
            }
        }
        // If the last statement is not a return, we might want to wrap it
        else {
            // Convert the entire block normally
            return ast2jeon(node, options)
        }
    }

    // Empty block
    return ast2jeon(node, options)
}

/**
 * Handle IIFE logic for Expression nodes
 */
function handleExpressionIIFE(node: acorn.Node, options?: { json?: typeof JSON, iife?: boolean }): any {
    // Handle parenthesized expressions
    if (node.type === 'ParenthesizedExpression') {
        const innerExpression = (node as any).expression

        // For object literals, they're already correctly wrapped
        if (innerExpression.type === 'ObjectExpression') {
            return ast2jeon(node, options)
        }
        // For array literals, they're already correctly wrapped
        else if (innerExpression.type === 'ArrayExpression') {
            return ast2jeon(node, options)
        }
        // For class expressions, they're already correctly wrapped
        else if (innerExpression.type === 'ClassExpression') {
            return ast2jeon(node, options)
        }
        // For arrow functions, they're already valid expressions
        else if (innerExpression.type === 'ArrowFunctionExpression') {
            return ast2jeon(node, options)
        }
        // For other expressions, convert normally
        else {
            return ast2jeon(node, options)
        }
    }
    // Handle direct object literals
    else if (node.type === 'ObjectExpression') {
        return {
            '(': ast2jeon(node, options)
        }
    }
    // Handle direct array literals
    else if (node.type === 'ArrayExpression') {
        return {
            '(': ast2jeon(node, options)
        }
    }
    // Handle direct class expressions
    else if (node.type === 'ClassExpression') {
        return {
            '(': ast2jeon(node, options)
        }
    }
    // Handle arrow functions
    else if (node.type === 'ArrowFunctionExpression') {
        return ast2jeon(node, options)
    }
    // For other expressions, convert normally
    else {
        return ast2jeon(node, options)
    }
}

/**
 * Handle multiple statements by returning the value of the last statement
 */
function handleMultipleStatementsIIFE(statements: (acorn.Statement | acorn.ModuleDeclaration)[], options?: { json?: typeof JSON, iife?: boolean }): any {
    // Check if we have statements
    if (statements.length > 0) {
        const lastStatement = statements[statements.length - 1]

        // Type guard to ensure we're dealing with a Statement
        if ('type' in lastStatement) {
            // If the last statement is an explicit return statement
            if (lastStatement.type === 'ReturnStatement') {
                // For programs ending with return statements, wrap in IIFE structure
                // Create a block statement containing all statements
                const blockStatement = {
                    type: 'BlockStatement',
                    body: statements
                }

                // Create the IIFE structure: { '(': { '()': [ { "() =>": { block } }, [] ] } }
                return {
                    '(': {
                        '()': [
                            {
                                "() =>": ast2jeon(blockStatement, options) // Body with no parameters
                            },
                            [] // No arguments
                        ]
                    }
                }
            }
            // If the last statement is an expression statement, we should implicitly return it in REPL mode
            else if (lastStatement.type === 'ExpressionStatement') {
                // Create a modified statements array with the last statement wrapped in a return
                const modifiedStatements = [...statements]
                modifiedStatements[modifiedStatements.length - 1] = {
                    type: 'ReturnStatement',
                    argument: (lastStatement as acorn.ExpressionStatement).expression
                } as acorn.ReturnStatement

                // Create a block statement containing all statements
                const blockStatement = {
                    type: 'BlockStatement',
                    body: modifiedStatements
                }

                // Create the IIFE structure: { '(': { '()': [ { "() =>": { block } }, [] ] } }
                return {
                    '(': {
                        '()': [
                            {
                                "() =>": ast2jeon(blockStatement, options) // Body with no parameters
                            },
                            [] // No arguments
                        ]
                    }
                }
            }
        }
    }

    // Convert all statements normally
    return statements.map(stmt => ast2jeon(stmt, options))
}