import { evalJeon } from '../safeEval'

// Handle control flow operators
export function evaluateIf(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && (operands.length === 2 || operands.length === 3)) {
        const condition = evalJeon(operands[0], context)
        if (condition) {
            return evalJeon(operands[1], context)
        } else if (operands.length === 3) {
            return evalJeon(operands[2], context)
        }
    }
}

export function evaluateWhile(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length === 2) {
        let result
        while (evalJeon(operands[0], context)) {
            result = evalJeon(operands[1], context)
        }
        return result
    }
}

export function evaluateFor(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length === 4) {
        // for loop: [init, test, update, body]
        evalJeon(operands[0], context) // init
        let result
        while (evalJeon(operands[1], context)) { // test
            result = evalJeon(operands[3], context) // body
            evalJeon(operands[2], context) // update
        }
        return result
    }
}

export function evaluateReturn(operands: any, context: Record<string, any>): any {
    return evalJeon(operands, context)
}

export function evaluateYield(operands: any, context: Record<string, any>): any {
    // Yield statements are handled within generator functions
    // This case should not be reached in normal evaluation
    throw new Error('yield can only be used inside generator functions')
}

export function evaluateYieldStar(operands: any, context: Record<string, any>): any {
    // Yield* statements are handled within generator functions
    // This case should not be reached in normal evaluation
    throw new Error('yield* can only be used inside generator functions')
}