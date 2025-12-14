import { evalJeon } from '../safeEval'

// Handle array-related operators
export function evaluateSpread(operands: any, context: Record<string, any>): any {
    // The spread operator is typically used in array or object contexts
    // For evaluation purposes, we just return the value
    return evalJeon(operands, context)
}

// TODO: Implement other array-related operators