import { evalJeon } from '../safeEval'

// Handle unary operators
export function evaluateTypeof(operands: any, context: Record<string, any>): any {
    if (operands !== undefined) {
        // Handle typeof operator
        return typeof evalJeon(operands, context)
    }
}

// TODO: Implement delete operator