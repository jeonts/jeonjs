import { evalJeon } from '../safeEval'

// Handle comparison operators
export function evaluateEqual(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length === 2) {
        return evalJeon(operands[0], context) == evalJeon(operands[1], context)
    }
}

export function evaluateStrictEqual(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length === 2) {
        return evalJeon(operands[0], context) === evalJeon(operands[1], context)
    }
}

export function evaluateNotEqual(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length === 2) {
        return evalJeon(operands[0], context) != evalJeon(operands[1], context)
    }
}

export function evaluateStrictNotEqual(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length === 2) {
        return evalJeon(operands[0], context) !== evalJeon(operands[1], context)
    }
}

export function evaluateLessThan(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length === 2) {
        return evalJeon(operands[0], context) < evalJeon(operands[1], context)
    }
}

export function evaluateGreaterThan(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length === 2) {
        return evalJeon(operands[0], context) > evalJeon(operands[1], context)
    }
}

export function evaluateLessThanOrEqual(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length === 2) {
        return evalJeon(operands[0], context) <= evalJeon(operands[1], context)
    }
}

export function evaluateGreaterThanOrEqual(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length === 2) {
        return evalJeon(operands[0], context) >= evalJeon(operands[1], context)
    }
}