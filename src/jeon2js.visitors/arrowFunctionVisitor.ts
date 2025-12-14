/**
 * Handles arrow function conversion in JEON to JavaScript
 * @param op The operator (arrow function syntax)
 * @param operands The operands for the arrow function
 * @param visit The visitor function to process nested elements
 * @param jsonImpl The JSON implementation to use (JSON or JSON5)
 */
export function visitArrowFunction(op: string, operands: any, visit: (item: any) => string, jsonImpl?: typeof JSON): string {
    // Handle flexible async arrow function declarations that match the async (...) => pattern
    if (op.startsWith('async ') && op.endsWith(' =>')) {
        const asyncArrowParamMatch = op.match(/\(([^)]*)\)/)
        const asyncArrowParams = asyncArrowParamMatch ? asyncArrowParamMatch[1].split(',').map((p: string) => p.trim()).filter((p: string) => p) : []
        const asyncArrowBody = Array.isArray(operands) ? operands.map((stmt: any) => visit(stmt)).join(';\n  ') : visit(operands)
        // Check if this is a block body (has explicit return statement) or expression
        if (Array.isArray(operands)) {
            // Multiple statements - block body
            const functionStr = `async (${asyncArrowParams.join(', ')}) => {\n  ${asyncArrowBody}\n}`
            return functionStr
        } else if (typeof operands === 'object' && operands !== null && operands.hasOwnProperty('return')) {
            // Single return statement - block body
            const functionStr = `async (${asyncArrowParams.join(', ')}) => {\n  ${asyncArrowBody}\n}`
            return functionStr
        } else {
            // Expression - wrap in return
            return `async (${asyncArrowParams.join(', ')}) => { return ${asyncArrowBody}; }`
        }
    }

    // Handle arrow functions with parameters in the key format: "(param1, param2) =>"
    if (op.endsWith(' =>')) {
        // Extract parameters from the key
        const paramMatch = op.match(/\(([^)]*)\)/)
        const params = paramMatch ? paramMatch[1].split(',').map((p: string) => p.trim()).filter((p: string) => p) : []

        // Process the body
        const body = Array.isArray(operands) ? operands.map((stmt: any) => visit(stmt)).join(';\n  ') : visit(operands)

        // Check if this is a block body (has explicit return statement) or expression
        if (Array.isArray(operands)) {
            // Multiple statements - block body
            const functionStr = `(${params.join(', ')}) => {\n  ${body}\n}`
            return functionStr
        } else if (typeof operands === 'object' && operands !== null && operands.hasOwnProperty('return')) {
            // Single return statement - block body
            const functionStr = `(${params.join(', ')}) => {\n  ${body}\n}`
            return functionStr
        } else {
            // Expression - no braces needed
            const functionStr = `(${params.join(', ')}) => ${body}`
            return functionStr
        }
    }

    return ''
}