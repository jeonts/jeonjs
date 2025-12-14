import { evalJeon } from '../safeEval'

// Handle bitwise shift operators
export function evaluateLeftShift(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length >= 2) {
        return operands.slice(1).reduce(
            (acc, curr) => acc << evalJeon(curr, context),
            evalJeon(operands[0], context)
        )
    }
}

export function evaluateRightShift(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length >= 2) {
        return operands.slice(1).reduce(
            (acc, curr) => acc >> evalJeon(curr, context),
            evalJeon(operands[0], context)
        )
    }
}

export function evaluateUnsignedRightShift(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length >= 2) {
        return operands.slice(1).reduce(
            (acc, curr) => acc >>> evalJeon(curr, context),
            evalJeon(operands[0], context)
        )
    }
}