// Handle await operator
export function evaluateAwait(operands: any, context: Record<string, any>): any {
    // Await statements are handled within async functions
    // This case should not be reached in normal evaluation
    throw new Error('await can only be used inside async functions')
}