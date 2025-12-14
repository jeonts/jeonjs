import { evalJeon } from '../safeEval'

// Handle logical operators
export function evaluateLogicalAnd(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length >= 2) {
        return operands.every(operand => evalJeon(operand, context))
    }
}

export function evaluateLogicalOr(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length >= 2) {
        return operands.some(operand => evalJeon(operand, context))
    }
}

export function evaluateLogicalNot(operands: any, context: Record<string, any>): any {
    if (operands !== undefined) {
        // Handle unary logical NOT
        return !evalJeon(operands, context)
    }
}