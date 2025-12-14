import * as acorn from 'acorn'
import jsx from 'acorn-jsx'
import { ast2jeon } from './js2jeon.visitors/ast2jeon'
import { positionCommentsInAST } from './js2jeon.visitors/commentPositioner'

/**
 * Converts JavaScript code to JEON (JSON-based Executable Object Notation)
 * @param code The JavaScript code to convert
 * @param options Conversion options
 * @param options.json The JSON implementation to use (JSON or JSON5)
 * @param options.iife Whether to automatically wrap expressions in an IIFE (immediately invoked function expression)
 */
export function js2jeon(code: string, options?: { json?: typeof JSON, iife?: boolean }): any {
    try {
        // Array to collect comments
        const comments: any[] = []

        // If iife option is enabled, try to automatically detect and handle expressions
        let codeToParse = code
        if (options?.iife) {
            const trimmedCode = code.trim()

            // Step 1: Try to parse as-is
            let ast: acorn.Program
            let parseSuccess = false
            let shouldTryParentheses = false

            try {
                const Parser = acorn.Parser.extend(jsx())
                ast = Parser.parse(trimmedCode, {
                    ecmaVersion: 'latest',
                    sourceType: 'module',
                    allowReturnOutsideFunction: true,
                    preserveParens: true
                })

                // Check if we should try parentheses for better expression handling
                // Specifically for empty blocks {} which should be object expressions
                if (ast.body.length === 1 &&
                    ast.body[0].type === 'BlockStatement' &&
                    (ast.body[0] as acorn.BlockStatement).body.length === 0) {
                    shouldTryParentheses = true
                }
                // Also check for other cases that might benefit from parentheses
                else if (ast.body.length === 1 &&
                    ast.body[0].type === 'ExpressionStatement' &&
                    (ast.body[0] as acorn.ExpressionStatement).expression.type === 'ObjectExpression') {
                    // Already correctly parsed as object expression, no need for parentheses
                }

                parseSuccess = true && !shouldTryParentheses
            } catch (initialParseError) {
                // Step 2: Try auto fix with () for {} maybe object literal
                shouldTryParentheses = true
            }

            // If we determined we should try parentheses, do so now
            if (shouldTryParentheses) {
                try {
                    const Parser = acorn.Parser.extend(jsx())
                    ast = Parser.parse(`(${trimmedCode})`, {
                        ecmaVersion: 'latest',
                        sourceType: 'module',
                        allowReturnOutsideFunction: true,
                        preserveParens: true
                    })
                    codeToParse = `(${trimmedCode})`
                    parseSuccess = true
                } catch (parenParseError) {
                    // Still error? Report & stop
                    throw parenParseError
                }
            }
        }

        // Parse the JavaScript/JavaScript code using Acorn with JSX support
        const Parser = acorn.Parser.extend(jsx())
        const ast: acorn.Program = Parser.parse(codeToParse, {
            ecmaVersion: 'latest',
            sourceType: 'module',
            allowReturnOutsideFunction: true,
            preserveParens: true,  // Preserve parentheses in the AST
            onComment: comments     // Collect comments
        })

        // Position comments within the AST based on their positions
        const astWithPositionedComments = positionCommentsInAST(ast, comments, new Set())

        // Convert AST to JEON
        return ast2jeon(astWithPositionedComments, options)
    } catch (error: any) {
        console.error('Error parsing JavaScript/JavaScript code:', error)
        // Return error message in JEON format instead of null
        throw error
    }
}