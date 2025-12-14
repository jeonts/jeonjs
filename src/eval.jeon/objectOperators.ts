import { evalJeon } from '../safeEval'

// Handle property access operator
export function evaluatePropertyAccess(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length >= 2) {
        // The first operand is the object, the rest are property names
        const obj = evalJeon(operands[0], context)

        // Chain property access
        let result = obj
        for (let i = 1; i < operands.length; i++) {
            // For property names, we should treat them as literals, not variable references
            // So we don't use evalJeon directly on them
            let prop: string
            const propOperand = operands[i]
            if (typeof propOperand === 'string') {
                // If it's a string starting with @, it's a variable reference
                if (propOperand.startsWith('@')) {
                    const cleanName = propOperand.substring(1)
                    prop = context[cleanName] ?? undefined
                } else {
                    // Otherwise, treat it as a literal property name
                    prop = propOperand
                }
            } else {
                // For non-string operands, evaluate them normally
                prop = evalJeon(propOperand, context)
            }

            // Check if property exists (handle both objects and functions)
            if (result && (typeof result === 'object' || typeof result === 'function') && prop in result) {
                result = result[prop]

                // If this is a method (function) and we're accessing it from an object,
                // bind the object as 'this' context
                if (typeof result === 'function' && i === operands.length - 1) {
                    // Special case: Don't bind static methods like Symbol.for
                    // Check if this is a built-in object with static methods
                    const isBuiltInStaticMethod = (
                        (obj === Symbol && (prop === 'for' || prop === 'keyFor')) ||
                        (obj === Object && ['assign', 'create', 'defineProperties', 'defineProperty', 'entries', 'freeze', 'fromEntries', 'getOwnPropertyDescriptor', 'getOwnPropertyDescriptors', 'getOwnPropertyNames', 'getOwnPropertySymbols', 'getPrototypeOf', 'is', 'isExtensible', 'isFrozen', 'isSealed', 'keys', 'preventExtensions', 'seal', 'setPrototypeOf', 'values'].includes(prop)) ||
                        (obj === Array && ['from', 'isArray', 'of'].includes(prop)) ||
                        (obj === Math && ['abs', 'acos', 'acosh', 'asin', 'asinh', 'atan', 'atan2', 'atanh', 'cbrt', 'ceil', 'clz32', 'cos', 'cosh', 'exp', 'expm1', 'floor', 'fround', 'hypot', 'imul', 'log', 'log10', 'log1p', 'log2', 'max', 'min', 'pow', 'random', 'round', 'sign', 'sin', 'sinh', 'sqrt', 'tan', 'tanh', 'trunc'].includes(prop))
                    )

                    // For user-defined static methods, we should also not bind them
                    // A simple heuristic: if the property name matches a function name and the object is a constructor function
                    const isLikelyStaticMethod = typeof obj === 'function' && obj.name && obj[prop] === result

                    if (!isBuiltInStaticMethod && !isLikelyStaticMethod) {
                        result = result.bind(obj)
                    }
                }
            } else {
                // If we can't access the property, return undefined
                return undefined
            }
        }
        return result
    }
}

// Handle bracket notation access operator
export function evaluateBracketAccess(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length === 2) {
        // First operand is the object, second is the key
        const obj = evalJeon(operands[0], context)
        const keyOperand = operands[1]

        // Evaluate the key expression
        let key: any
        if (typeof keyOperand === 'string') {
            // If it's a string starting with @, it's a variable reference
            if (keyOperand.startsWith('@')) {
                const cleanName = keyOperand.substring(1)
                key = context[cleanName] ?? undefined
            } else {
                // Otherwise, treat it as a literal key
                key = keyOperand
            }
        } else {
            // For non-string operands, evaluate them normally
            key = evalJeon(keyOperand, context)
        }

        // Access the property
        if (obj && (typeof obj === 'object' || typeof obj === 'function') && key !== undefined) {
            return obj[key]
        }

        return undefined
    }
}