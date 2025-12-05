import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitCallExpression(node: acorn.CallExpression, options?: { json?: typeof JSON }): any {
    // Check if it's a method call or function call
    if (node.callee.type === 'MemberExpression') {
        // Method call - convert to JEON function execution format
        const callee = node.callee as acorn.MemberExpression
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
                ...node.arguments.map(arg => ast2jeon(arg, options))
            ]
        }
    } else {
        // Handle ParenthesizedExpression that contains a function
        let calleeNode: any = node.callee
        // Unwrap parentheses to get to the actual function
        while (calleeNode.type === 'ParenthesizedExpression') {
            calleeNode = (calleeNode as acorn.ParenthesizedExpression).expression
        }

        // Check if this is an IIFE - function expression being immediately invoked
        if ((calleeNode.type === 'FunctionExpression' || calleeNode.type === 'ArrowFunctionExpression') &&
            node.arguments.length > 0) {
            // This is an IIFE, convert it to a regular function call with arguments
            // For IIFE with arguments like ((x) => { return x * 2; })(4), 
            // we want to extract the function and convert it properly

            // Create a temporary function name for the IIFE
            return {
                '()': [
                    ast2jeon(calleeNode, options),
                    ...node.arguments.map(arg => ast2jeon(arg, options))
                ]
            }
        } else if (calleeNode.type === 'Identifier') {
            // Regular function call - use explicit () operator syntax (no sugar)
            const functionName = (calleeNode as acorn.Identifier).name
            return {
                '()': [
                    `@${functionName}`,
                    ...node.arguments.map(arg => ast2jeon(arg, options))
                ]
            }
        } else {
            // For other callee types, convert the callee and arguments directly
            return {
                '()': [
                    ast2jeon(calleeNode, options),
                    ...node.arguments.map(arg => ast2jeon(arg, options))
                ]
            }
        }
    }
}