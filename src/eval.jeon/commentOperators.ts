// Handle comment operators
export function evaluateLineComment(operands: any, context: Record<string, any>): any {
    // Line comments don't affect evaluation, just return undefined
    return undefined
}

export function evaluateBlockComment(operands: any, context: Record<string, any>): any {
    // Block comments don't affect evaluation, just return undefined
    return undefined
}