/**
 * Handles array conversion in JEON to JavaScript
 * @param jeon The array to convert
 * @param visit The visitor function to process nested elements
 * @param jsonImpl The JSON implementation to use (JSON or JSON5)
 * @param isTopLevel Whether this is a top-level call (default: false)
 */
export function visitArray(jeon: any[], visit: (item: any) => string, jsonImpl?: typeof JSON, isTopLevel: boolean = false): string {
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
        const statements = jeon.map(expr => visit(expr)).join(';\n  ')
        // Only wrap in IIFE if not at top level
        if (!isTopLevel) {
            return `(() => {\n  ${statements};\n})()`
        } else {
            // For top-level, just join the statements
            return statements.replace(/;\n  /g, ';\n')
        }
    }

    return `[${jeon.map(item => visit(item)).join(', ')}]`
}