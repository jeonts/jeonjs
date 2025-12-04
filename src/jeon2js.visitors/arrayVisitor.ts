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
        (Object.keys(item).some(key =>
            key.startsWith('function') || key.startsWith('async function') || key.startsWith('function*') ||
            key === '@' || key === '@@' ||
            key === 'if' || key === 'while' || key === 'for' ||
            key === 'switch' || key === 'try' || key === 'return' ||
            key === 'break' || key === 'continue' || key === 'throw' || key === 'debugger' ||
            key === 'class' || key === 'import' || key === 'export' ||
            key === '()' || key.endsWith('=>')
        )))

    if (hasStatementObjects) {
        // Handle sequencing blocks
        const statementResults = jeon.map(expr => {
            const result = visit(expr)
            // Handle empty statements - already a semicolon, don't add another
            if (result === ';') {
                return ';'
            }
            // Don't add semicolons to comments (they already have proper formatting with newlines)
            if (result.startsWith('\n//') && result.endsWith('\n')) {
                return result
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
    const elementStrings = jeon.map(item => {
        // Handle special array element cases for sparse arrays
        if (item === '@undefined') {
            // @undefined represents a sparse array hole
            return null
        } else if (item === '@@undefined') {
            // @@undefined represents an explicit undefined in the array
            return 'undefined'
        } else {
            return visit(item)
        }
    })

    // Join elements, handling special formatting for comments and sparse arrays
    const formattedElements = []
    for (let i = 0; i < elementStrings.length; i++) {
        const element = elementStrings[i]

        // Add the element (or empty slot for sparse arrays)
        if (element !== null) {
            // Add a space before non-first elements that are not comments
            if (formattedElements.length > 0 && !(element && element.match(/^\n\/\//) && element.endsWith('\n'))) {
                formattedElements.push(' ')
            }
            formattedElements.push(element)
        }

        // Add separator after the element (except for the last one)
        if (i < elementStrings.length - 1) {
            // Check if this element is a comment (starts with newline and //)
            if (element && element.match(/^\n\/\//) && element.endsWith('\n')) {
                // For comment elements, add a comma and newline
                formattedElements.push(',\n')
            } else if (element === null) {
                // For null elements (sparse holes), just add a comma
                formattedElements.push(',')
            } else {
                // For regular elements, add a comma
                formattedElements.push(',')
            }
        }
    }

    return `[${formattedElements.join('')}]`
}