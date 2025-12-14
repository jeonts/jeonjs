import { JeonObject } from '../JeonExpression'
import { evalJeon } from '../safeEval'

// Handle assignment operators
export function evaluateAssignment(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length === 2) {
        // For assignment, the first operand should be the variable name (not evaluated)
        // The second operand should be the value (evaluated)
        const varNameExpr = operands[0]
        const value = evalJeon(operands[1], context)

        // Get the variable name as a string
        let varName: string
        if (typeof varNameExpr === 'string' && varNameExpr.startsWith('@')) {
            varName = varNameExpr.substring(1) // Remove the '@' prefix
        } else if (typeof varNameExpr === 'string') {
            varName = varNameExpr
        } else {
            varName = evalJeon(varNameExpr, context) as string
        }

        // Handle property assignment like { '.': ['@this', 'name'] }
        if (varNameExpr && typeof varNameExpr === 'object' && !Array.isArray(varNameExpr) && '.' in varNameExpr) {
            // This is a property assignment like this.name = value
            const propAccessExpr = (varNameExpr as any)['.'] as any[]
            if (Array.isArray(propAccessExpr) && propAccessExpr.length >= 2) {
                const obj = evalJeon(propAccessExpr[0], context)
                // For property names, we should use them literally, not look them up in context
                const prop = propAccessExpr[1]
                obj[prop] = value
                return value
            }
        }

        // Reject shortcuts like @this.name - must use explicit { '.': ['@this', 'name'] }
        if (typeof varName === 'string' && varName.includes('.')) {
            throw new Error(`Invalid assignment target '@${varName}': member access shortcuts not allowed. Use explicit '.' operator: { ".": ["@${varName.split('.')[0]}", ...] }`)
        }
        // Handle simple variable assignment
        context[varName] = value
        return value
    }
}

// TODO: Implement other assignment operators (+=, -=, *=, /=, %=, etc.)