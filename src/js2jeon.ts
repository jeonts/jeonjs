import * as acorn from 'acorn'
import jsx from 'acorn-jsx'
import { ast2jeon } from './js2jeon.visitors/ast2jeon'

/**
 * Converts JavaScript code to JEON (JSON-based Executable Object Notation)
 * @param code The JavaScript code to convert
 * @param options Conversion options
 * @param options.json The JSON implementation to use (JSON or JSON5)
 */
export function js2jeon(code: string, options?: { json?: typeof JSON }): any {
    try {
        // Array to collect comments
        const comments: any[] = []

        // Parse the JavaScript/JavaScript code using Acorn with JSX support
        const Parser = acorn.Parser.extend(jsx())
        const ast: any = Parser.parse(code, {
            ecmaVersion: 'latest',
            sourceType: 'module',
            allowReturnOutsideFunction: true,
            preserveParens: true,  // Preserve parentheses in the AST
            onComment: comments     // Collect comments
        })

        // Inject comments into the AST
        const astWithComments = {
            ...ast,
            comments: comments
        }

        // Convert AST to JEON
        return ast2jeon(astWithComments, options)
    } catch (error: any) {
        console.error('Error parsing JavaScript/JavaScript code:', error)
        // Return error message in JEON format instead of null
        throw error
        // return {
        //     "error": `Parsing Error: ${error.message}`   
        // }
    }
}