/**
 * Handles arrow function conversion in JEON to JavaScript
 * @param op The operator (arrow function syntax)
 * @param operands The operands for the arrow function
 * @param visit The visitor function to process nested elements
 * @param jsonImpl The JSON implementation to use (JSON or JSON5)
 * @param closure Whether to enable closure mode for safe evaluation (default: false)
 */
export function visitArrowFunction(op: string, operands: any, visit: (item: any) => string, jsonImpl?: typeof JSON, closure: boolean = false): string {
    // Handle flexible async arrow function declarations that match the async (...) => pattern
    if (op.startsWith('async ') && op.endsWith(' =>')) {
        const asyncArrowParamMatch = op.match(/\(([^)]*)\)/)
        const asyncArrowParams = asyncArrowParamMatch ? asyncArrowParamMatch[1].split(',').map((p: string) => p.trim()).filter((p: string) => p) : []
        const asyncArrowBody = Array.isArray(operands) ? operands.map((stmt: any) => visit(stmt)).join(';\n  ') : visit(operands)
        // Check if this is a block body (has explicit return statement) or expression
        if (Array.isArray(operands)) {
            // Multiple statements - block body
            const functionStr = `async (${asyncArrowParams.join(', ')}) => {\n  ${asyncArrowBody}\n}`
            // If closure mode is enabled, wrap the function in evalJeon
            if (closure) {
                // Create a JEON representation of the function body only
                const contextObj = asyncArrowParams.map(p => `${p}: ${p}`).join(', ')
                return `(${asyncArrowParams.join(', ')}) => evalJeon(${JSON.stringify(operands)}, {${contextObj}})`
            }
            return functionStr
        } else if (typeof operands === 'object' && operands !== null && operands.hasOwnProperty('return')) {
            // Single return statement - block body
            const functionStr = `async (${asyncArrowParams.join(', ')}) => {\n  ${asyncArrowBody}\n}`
            // If closure mode is enabled, wrap the function in evalJeon
            if (closure) {
                // Create a JEON representation of the function body only
                const contextObj = asyncArrowParams.map(p => `${p}: ${p}`).join(', ')
                return `(${asyncArrowParams.join(', ')}) => evalJeon(${JSON.stringify(operands)}, {${contextObj}})`
            }
            return functionStr
        } else {
            // Expression - wrap in return
            const functionStr = `async (${asyncArrowParams.join(', ')}) => { return ${asyncArrowBody}; }`
            // If closure mode is enabled, wrap the function in evalJeon
            if (closure) {
                // Create a JEON representation of the function body only
                const contextObj = asyncArrowParams.map(p => `${p}: ${p}`).join(', ')
                return `(${asyncArrowParams.join(', ')}) => evalJeon(${JSON.stringify(operands)}, {${contextObj}})`
            }
            return functionStr
        }
    }

    // Handle arrow functions with parameters
    if (op.includes('=>')) {
        const arrowParamMatch = op.match(/\(([^)]*)\)/)
        const arrowParams = arrowParamMatch ? arrowParamMatch[1].split(',').map((p: string) => p.trim()).filter((p: string) => p) : []
        const arrowBody = Array.isArray(operands) ? operands.map((stmt: any) => visit(stmt)).join(';\n  ') : visit(operands)
        // Check if this is a block body (has explicit return statement) or expression
        if (Array.isArray(operands)) {
            // Multiple statements - block body
            const functionStr = `(${arrowParams.join(', ')}) => {\n  ${arrowBody}\n}`
            // If closure mode is enabled, wrap the function in evalJeon
            if (closure) {
                // Create a JEON representation of the function body only
                const contextObj = arrowParams.map(p => `${p}: ${p}`).join(', ')
                return `(${arrowParams.join(', ')}) => evalJeon(${JSON.stringify(operands)}, {${contextObj}})`
            }
            return functionStr
        } else if (typeof operands === 'object' && operands !== null && operands.hasOwnProperty('return')) {
            // Single return statement - block body
            const functionStr = `(${arrowParams.join(', ')}) => {\n  ${arrowBody}\n}`
            // If closure mode is enabled, wrap the function in evalJeon
            if (closure) {
                // Create a JEON representation of the function body only
                const contextObj = arrowParams.map(p => `${p}: ${p}`).join(', ')
                return `(${arrowParams.join(', ')}) => evalJeon(${JSON.stringify(operands)}, {${contextObj}})`
            }
            return functionStr
        } else {
            // Expression - no braces needed
            const functionStr = `(${arrowParams.join(', ')}) => ${arrowBody}`
            // If closure mode is enabled, wrap the function in evalJeon
            if (closure) {
                // Create a JEON representation of the function body only
                const contextObj = arrowParams.map(p => `${p}: ${p}`).join(', ')
                return `(${arrowParams.join(', ')}) => evalJeon(${JSON.stringify(operands)}, {${contextObj}})`
            }
            return functionStr
        }
    }

    return ''
}