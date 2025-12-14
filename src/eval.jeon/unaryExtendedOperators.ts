import { evalJeon } from '../safeEval'

// Handle extended unary operators
export function evaluateVoid(operands: any, context: Record<string, any>): any {
    if (operands !== undefined) {
        // Handle void operator
        evalJeon(operands, context)
        return undefined
    }
}

export function evaluateDelete(operands: any, context: Record<string, any>): any {
    // Handle delete operator
    // In a safe evaluation context, we might not want to allow actual deletion
    // For now, we'll just return true to indicate "successful" deletion
    return true
}