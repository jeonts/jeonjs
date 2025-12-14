import { evalJeon } from '../safeEval'

// Handle compound assignment operators
export function evaluateAddAssignment(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length === 2) {
        const varNameExpr = operands[0]
        const valueToAdd = evalJeon(operands[1], context)

        let varName: string
        if (typeof varNameExpr === 'string' && varNameExpr.startsWith('@')) {
            varName = varNameExpr.substring(1) // Remove the '@' prefix
        } else if (typeof varNameExpr === 'string') {
            varName = varNameExpr
        } else {
            varName = evalJeon(varNameExpr, context) as string
        }

        // Get current value, add to it, and store it back
        const currentValue = context[varName] ?? 0
        const newValue = currentValue + valueToAdd
        context[varName] = newValue
        return newValue
    }
}

export function evaluateSubtractAssignment(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length === 2) {
        const varNameExpr = operands[0]
        const valueToSubtract = evalJeon(operands[1], context)

        let varName: string
        if (typeof varNameExpr === 'string' && varNameExpr.startsWith('@')) {
            varName = varNameExpr.substring(1) // Remove the '@' prefix
        } else if (typeof varNameExpr === 'string') {
            varName = varNameExpr
        } else {
            varName = evalJeon(varNameExpr, context) as string
        }

        // Get current value, subtract from it, and store it back
        const currentValue = context[varName] ?? 0
        const newValue = currentValue - valueToSubtract
        context[varName] = newValue
        return newValue
    }
}

export function evaluateMultiplyAssignment(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length === 2) {
        const varNameExpr = operands[0]
        const valueToMultiply = evalJeon(operands[1], context)

        let varName: string
        if (typeof varNameExpr === 'string' && varNameExpr.startsWith('@')) {
            varName = varNameExpr.substring(1) // Remove the '@' prefix
        } else if (typeof varNameExpr === 'string') {
            varName = varNameExpr
        } else {
            varName = evalJeon(varNameExpr, context) as string
        }

        // Get current value, multiply it, and store it back
        const currentValue = context[varName] ?? 0
        const newValue = currentValue * valueToMultiply
        context[varName] = newValue
        return newValue
    }
}

export function evaluateDivideAssignment(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length === 2) {
        const varNameExpr = operands[0]
        const valueToDivide = evalJeon(operands[1], context)

        let varName: string
        if (typeof varNameExpr === 'string' && varNameExpr.startsWith('@')) {
            varName = varNameExpr.substring(1) // Remove the '@' prefix
        } else if (typeof varNameExpr === 'string') {
            varName = varNameExpr
        } else {
            varName = evalJeon(varNameExpr, context) as string
        }

        // Get current value, divide it, and store it back
        const currentValue = context[varName] ?? 0
        const newValue = currentValue / valueToDivide
        context[varName] = newValue
        return newValue
    }
}

export function evaluateModuloAssignment(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length === 2) {
        const varNameExpr = operands[0]
        const valueToModulo = evalJeon(operands[1], context)

        let varName: string
        if (typeof varNameExpr === 'string' && varNameExpr.startsWith('@')) {
            varName = varNameExpr.substring(1) // Remove the '@' prefix
        } else if (typeof varNameExpr === 'string') {
            varName = varNameExpr
        } else {
            varName = evalJeon(varNameExpr, context) as string
        }

        // Get current value, modulo it, and store it back
        const currentValue = context[varName] ?? 0
        const newValue = currentValue % valueToModulo
        context[varName] = newValue
        return newValue
    }
}

export function evaluateLeftShiftAssignment(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length === 2) {
        const varNameExpr = operands[0]
        const valueToShift = evalJeon(operands[1], context)

        let varName: string
        if (typeof varNameExpr === 'string' && varNameExpr.startsWith('@')) {
            varName = varNameExpr.substring(1) // Remove the '@' prefix
        } else if (typeof varNameExpr === 'string') {
            varName = varNameExpr
        } else {
            varName = evalJeon(varNameExpr, context) as string
        }

        // Get current value, left shift it, and store it back
        const currentValue = context[varName] ?? 0
        const newValue = currentValue << valueToShift
        context[varName] = newValue
        return newValue
    }
}

export function evaluateRightShiftAssignment(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length === 2) {
        const varNameExpr = operands[0]
        const valueToShift = evalJeon(operands[1], context)

        let varName: string
        if (typeof varNameExpr === 'string' && varNameExpr.startsWith('@')) {
            varName = varNameExpr.substring(1) // Remove the '@' prefix
        } else if (typeof varNameExpr === 'string') {
            varName = varNameExpr
        } else {
            varName = evalJeon(varNameExpr, context) as string
        }

        // Get current value, right shift it, and store it back
        const currentValue = context[varName] ?? 0
        const newValue = currentValue >> valueToShift
        context[varName] = newValue
        return newValue
    }
}

export function evaluateUnsignedRightShiftAssignment(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length === 2) {
        const varNameExpr = operands[0]
        const valueToShift = evalJeon(operands[1], context)

        let varName: string
        if (typeof varNameExpr === 'string' && varNameExpr.startsWith('@')) {
            varName = varNameExpr.substring(1) // Remove the '@' prefix
        } else if (typeof varNameExpr === 'string') {
            varName = varNameExpr
        } else {
            varName = evalJeon(varNameExpr, context) as string
        }

        // Get current value, unsigned right shift it, and store it back
        const currentValue = context[varName] ?? 0
        const newValue = currentValue >>> valueToShift
        context[varName] = newValue
        return newValue
    }
}

export function evaluateBitwiseAndAssignment(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length === 2) {
        const varNameExpr = operands[0]
        const valueToAnd = evalJeon(operands[1], context)

        let varName: string
        if (typeof varNameExpr === 'string' && varNameExpr.startsWith('@')) {
            varName = varNameExpr.substring(1) // Remove the '@' prefix
        } else if (typeof varNameExpr === 'string') {
            varName = varNameExpr
        } else {
            varName = evalJeon(varNameExpr, context) as string
        }

        // Get current value, bitwise AND it, and store it back
        const currentValue = context[varName] ?? 0
        const newValue = currentValue & valueToAnd
        context[varName] = newValue
        return newValue
    }
}

export function evaluateBitwiseXorAssignment(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length === 2) {
        const varNameExpr = operands[0]
        const valueToXor = evalJeon(operands[1], context)

        let varName: string
        if (typeof varNameExpr === 'string' && varNameExpr.startsWith('@')) {
            varName = varNameExpr.substring(1) // Remove the '@' prefix
        } else if (typeof varNameExpr === 'string') {
            varName = varNameExpr
        } else {
            varName = evalJeon(varNameExpr, context) as string
        }

        // Get current value, bitwise XOR it, and store it back
        const currentValue = context[varName] ?? 0
        const newValue = currentValue ^ valueToXor
        context[varName] = newValue
        return newValue
    }
}

export function evaluateBitwiseOrAssignment(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length === 2) {
        const varNameExpr = operands[0]
        const valueToOr = evalJeon(operands[1], context)

        let varName: string
        if (typeof varNameExpr === 'string' && varNameExpr.startsWith('@')) {
            varName = varNameExpr.substring(1) // Remove the '@' prefix
        } else if (typeof varNameExpr === 'string') {
            varName = varNameExpr
        } else {
            varName = evalJeon(varNameExpr, context) as string
        }

        // Get current value, bitwise OR it, and store it back
        const currentValue = context[varName] ?? 0
        const newValue = currentValue | valueToOr
        context[varName] = newValue
        return newValue
    }
}