import { evalJeon } from '../safeEval'

// Handle bitwise operators
export function evaluateBitwiseNot(operands: any, context: Record<string, any>): any {
    if (operands !== undefined) {
        // Handle unary bitwise NOT
        return ~evalJeon(operands, context)
    }
}

export function evaluateBitwiseAnd(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length >= 2) {
        return operands.reduce((acc, curr) =>
            evalJeon(acc, context) & evalJeon(curr, context)
        )
    }
}

export function evaluateBitwiseOr(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length >= 2) {
        return operands.reduce((acc, curr) =>
            evalJeon(acc, context) | evalJeon(curr, context)
        )
    }
}

export function evaluateBitwiseXor(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length >= 2) {
        return operands.reduce((acc, curr) =>
            evalJeon(acc, context) ^ evalJeon(curr, context)
        )
    }
}