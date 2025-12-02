import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitArrayExpression(node: acorn.ArrayExpression, options?: { json?: typeof JSON }): any {
    // Handle array literals with a special '[' operator
    // Use @undefined for sparse array holes and @@undefined for explicit undefined values
    return {
        '[': (node as acorn.ArrayExpression).elements
            .map(element => {
                // Use @undefined for null elements (holes in sparse arrays)
                if (element === null) {
                    return '@undefined'
                }
                // Check if this is an explicit undefined identifier
                if (element.type === 'Identifier' && element.name === 'undefined') {
                    // Use @@undefined for explicit undefined values in arrays
                    return '@@undefined'
                }
                return ast2jeon(element!, options)
            })
    }
}