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

        // If iife option is enabled, wrap the code in parentheses for expressions
        let codeToParse = code;
        if (options?.iife) {
            // Check if the code looks like a standalone expression that might be parsed incorrectly
            // For example, {} gets parsed as a block statement, not an object literal
            const trimmedCode = code.trim();
            
            // Check for common expression patterns that need parentheses
            if (
                // Object literals
                (trimmedCode.startsWith('{') && trimmedCode.endsWith('}')) ||
                // Array literals
                (trimmedCode.startsWith('[') && trimmedCode.endsWith(']')) ||
                // Regex literals
                trimmedCode.startsWith('/') ||
                // Template literals
                trimmedCode.startsWith('`') ||
                // Arrow functions without braces
                (trimmedCode.includes('=>') && !trimmedCode.includes('{')) ||
                // Simple identifiers that could be expressions
                (!trimmedCode.includes(' ') && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(trimmedCode) && !['return', 'const', 'let', 'var', 'function', 'class', 'if', 'for', 'while', 'switch', 'try', 'catch', 'finally', 'break', 'continue', 'throw', 'debugger', 'do', 'with', 'export', 'import', 'yield', 'await', 'async', 'static', 'get', 'set', 'extends'].includes(trimmedCode))
            ) {
                codeToParse = `(${code})`;
            }
        }

        // Parse the JavaScript/JavaScript code using Acorn with JSX support
        const Parser = acorn.Parser.extend(jsx())
        const ast: any = Parser.parse(codeToParse, {
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
        // return {
        //     "error": `Parsing Error: ${error.message}`   
        // }
    }
}