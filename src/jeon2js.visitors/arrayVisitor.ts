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
    // Only treat as sequencing block if it contains actual statement objects
    const hasStatementObjects = jeon.some(item =>
        typeof item === 'object' && item !== null &&
        (item['function()'] || item['const'] || item['let'] || item['var'] ||
            item['if'] || item['while'] || item['for'] ||
            item['switch'] || item['try'] || item['return'] ||
            item['break'] || item['continue'] || item['throw'] || item['debugger'] ||
            item['class'] || item['import'] || item['export']))

    if (hasStatementObjects) {
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

    // Process array elements
    const elementStrings = jeon.map(item => visit(item))

    // Join elements, handling special formatting for comments
    const formattedElements = []
    for (let i = 0; i < elementStrings.length; i++) {
        const element = elementStrings[i]

        // Add the element
        formattedElements.push(element)

        // Add separator after the element (except for the last one)
        if (i < elementStrings.length - 1) {
            // Check if this element is a comment (starts with newline and //)
            if (element && element.match(/^\n\/\//) && element.endsWith('\n')) {
                // For comment elements, add a comma and newline
                formattedElements.push(',\n')
            } else {
                // For regular elements, add a comma and space
                formattedElements.push(', ')
            }
        }
    }

    return `[${formattedElements.join('')}]`
}