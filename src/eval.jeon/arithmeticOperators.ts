import { JeonExpression } from '../JeonExpression'
import { evalJeon } from '../safeEval'

// Handle arithmetic operators
export function evaluatePlus(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands)) {
        if (operands.length === 1) {
            return +evalJeon(operands[0], context)
        } else if (operands.length >= 2) {
            // Handle multiple operands for addition
            return operands.reduce((acc, curr) =>
                evalJeon(acc, context) + evalJeon(curr, context)
            )
        }
    } else if (operands !== undefined) {
        // Handle unary plus
        return +evalJeon(operands, context)
    }
}

export function evaluateMinus(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands)) {
        if (operands.length === 1) {
            return -evalJeon(operands[0], context)
        } else if (operands.length >= 2) {
            return operands.slice(1).reduce(
                (acc, curr) => acc - evalJeon(curr, context),
                evalJeon(operands[0], context)
            )
        }
    } else if (operands !== undefined) {
        // Handle unary minus
        return -evalJeon(operands, context)
    }
}

export function evaluateMultiply(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length >= 2) {
        return operands.reduce((acc, curr) =>
            evalJeon(acc, context) * evalJeon(curr, context)
        )
    }
}

export function evaluateDivide(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length >= 2) {
        return operands.slice(1).reduce(
            (acc, curr) => acc / evalJeon(curr, context),
            evalJeon(operands[0], context)
        )
    }
}

export function evaluateModulo(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length >= 2) {
        return operands.slice(1).reduce(
            (acc, curr) => acc % evalJeon(curr, context),
            evalJeon(operands[0], context)
        )
    }
}