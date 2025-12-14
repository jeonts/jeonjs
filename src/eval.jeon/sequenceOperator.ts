import { evalJeon } from '../safeEval'

// Handle sequence expressions (comma operator)
export function evaluateSequence(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands)) {
        // Evaluate all expressions in sequence and return the last one
        // For function expressions in sequences, make named functions available to subsequent expressions
        let result: any
        for (const operand of operands) {
            result = evalJeon(operand, context)

            // Check if this operand is a function call expression that defines a named function
            // This handles the special case: (function a(name) { ... }, a('world'))
            if (operand && typeof operand === 'object' && !Array.isArray(operand)) {
                const operandKeys = Object.keys(operand)
                // Look for a function expression with a name
                for (const key of operandKeys) {
                    if (key.startsWith('function ') && key.includes('(')) {
                        // Extract function name from pattern like "function a(name)"
                        const nameMatch = key.match(/function\s+(\w+)\s*\(/)
                        if (nameMatch && result && typeof result === 'function') {
                            const functionName = nameMatch[1]
                            context[functionName] = result
                        }
                    }
                }
            }
        }
        return result
    }
}