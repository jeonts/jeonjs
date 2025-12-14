import { evalJeon } from '../safeEval'

// Handle new operator
export function evaluateNew(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length >= 1) {
        const constructor = evalJeon(operands[0], context)
        const args = operands.slice(1).map(arg => evalJeon(arg, context))
        // Handle constructor with different argument counts
        // Use Reflect.construct or Function.prototype.apply for proper instantiation
        return new constructor(...args)
    }
}