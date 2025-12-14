import { evalJeon } from '../safeEval'

// Handle increment/decrement operators
export function evaluateIncrement(operands: any, context: Record<string, any>): any {
    if (operands !== undefined) {
        // Handle unary increment (postfix and prefix)
        // For simplicity, we'll treat both the same way in JEON representation
        const varNameExpr = operands
        let varName: string
        if (typeof varNameExpr === 'string' && varNameExpr.startsWith('@')) {
            varName = varNameExpr.substring(1) // Remove the '@' prefix
        } else if (typeof varNameExpr === 'string') {
            varName = varNameExpr
        } else {
            varName = evalJeon(varNameExpr, context) as string
        }

        // Get current value, increment it, and store it back
        const currentValue = context[varName] ?? 0
        const newValue = currentValue + 1
        context[varName] = newValue
        // For postfix increment (i++), we should return the original value
        // Since we don't distinguish between postfix and prefix in JEON,
        // we'll assume it's postfix and return the original value
        return currentValue
    }
}

export function evaluateDecrement(operands: any, context: Record<string, any>): any {
    if (operands !== undefined) {
        // Handle unary decrement (postfix and prefix)
        // For simplicity, we'll treat both the same way in JEON representation
        const varNameExpr = operands
        let varName: string
        if (typeof varNameExpr === 'string' && varNameExpr.startsWith('@')) {
            varName = varNameExpr.substring(1) // Remove the '@' prefix
        } else if (typeof varNameExpr === 'string') {
            varName = varNameExpr
        } else {
            varName = evalJeon(varNameExpr, context) as string
        }

        // Get current value, decrement it, and store it back
        const currentValue = context[varName] ?? 0
        const newValue = currentValue - 1
        context[varName] = newValue
        // For postfix decrement (i--), we should return the original value
        // Since we don't distinguish between postfix and prefix in JEON,
        // we'll assume it's postfix and return the original value
        return currentValue
    }
}