import { JeonObject } from '../JeonExpression'
import { evalJeon } from '../safeEval'

// Handle special operators
export function evaluateParentheses(operands: any, context: Record<string, any>): any {
    // Handle parentheses - just evaluate the contents
    return evalJeon(operands, context)
}

export function evaluateRegex(operands: any, context: Record<string, any>): any {
    // Handle regex operator
    if (typeof operands === 'object' && operands !== null) {
        // Check if operands has pattern and flags properties
        if ('pattern' in operands && 'flags' in operands) {
            const pattern = (operands as { pattern: string; flags: string }).pattern || ''
            const flags = (operands as { pattern: string; flags: string }).flags || ''
            return new RegExp(pattern, flags)
        } else {
            // Handle case where operands is a regular object
            const pattern = (operands as JeonObject).pattern || ''
            const flags = (operands as JeonObject).flags || ''
            return new RegExp(pattern as string || '', flags as string || '')
        }
    }
    return new RegExp('(?:)')
}

export function evaluateConditional(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length === 3) {
        const condition = evalJeon(operands[0], context)
        return condition ?
            evalJeon(operands[1], context) :
            evalJeon(operands[2], context)
    }
}