import { jeon2js } from '../jeon2js'
import { evalJeon } from '../safeEval'

// Handle function call operator
export function evaluateFunctionCall(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length >= 1) {
        // First operand is the function reference
        const funcRef = evalJeon(operands[0], context)
        // Remaining operands are the arguments
        const args = operands.slice(1).map(arg => evalJeon(arg, context))

        // Handle different types of function references
        if (typeof funcRef === 'function') {
            return funcRef(...args)
        }

        // If funcRef is a callable function, call it
        if (funcRef && typeof funcRef === 'object' && 'call' in funcRef) {
            return funcRef.call(null, ...args)
        }
        else {
            // Get function name for better error message
            const funcName = jeon2js(operands[0])
            throw new Error(`Cannot call non-function '${funcName}': ${typeof funcRef === 'object' ? 'object' : funcRef}`)
        }
    }
}