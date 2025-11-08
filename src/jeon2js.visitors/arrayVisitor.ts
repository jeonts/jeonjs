/**
 * Handles array conversion in JEON to JavaScript
 * @param jeon The array to convert
 * @param visit The visitor function to process nested elements
 * @param jsonImpl The JSON implementation to use (JSON or JSON5)
 * @param isTopLevel Whether this is a top-level call (default: false)
 * @param closure Whether to enable closure mode for safe evaluation (default: false)
 */
export function visitArray(jeon: any[], visit: (item: any) => string, jsonImpl?: typeof JSON, isTopLevel: boolean = false, closure: boolean = false): string {
    // Handle execution blocks (arrays)
    // Check if this array contains a spread operator
    if (jeon.length === 1 && typeof jeon[0] === 'object' && jeon[0] !== null && jeon[0]['...']) {
        const spreadValue = visit(jeon[0]['...'])
        return `[...${spreadValue}]`
    }

    if (jeon.length === 0) {
        return '[]'
    }

    // Check if it's a special construct
    const firstElement = jeon[0]
    if (typeof firstElement === 'object' && firstElement !== null) {
        // Handle sequencing blocks
        const statementResults = jeon.map(expr => {
            const result = visit(expr)
            // Handle empty statements - already a semicolon, don't add another
            if (result === ';') {
                return ';'
            }
            // Don't add semicolons to function declarations or variable declarations
            if (result.trim().startsWith('function') || result.trim().startsWith('const ') || result.trim().startsWith('let ') || result.trim().startsWith('var ')) {
                return result
            }
            // Add semicolon if it doesn't already end with one
            return result.endsWith(';') ? result : result + ';'
        })

        // Remove semicolon from the last statement if it's not needed
        if (statementResults.length > 0) {
            const lastStatement = statementResults[statementResults.length - 1]
            if (lastStatement.endsWith(';')) {
                statementResults[statementResults.length - 1] = lastStatement.slice(0, -1)
            }
        }

        const statements = statementResults.join('\n')
        // Only wrap in IIFE if not at top level
        if (!isTopLevel) {
            return `(() => {\n  ${statements}\n})()`
        } else {
            // For top-level, just join the statements
            return statements
        }
    }

    return `[${jeon.map(item => visit(item)).join(', ')}]`
}