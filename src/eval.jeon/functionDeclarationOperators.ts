import { evalJeon } from '../safeEval'

// Handle function declarations
export function evaluateFunction(operands: any, context: Record<string, any>): any {
    // Function declarations evaluate to undefined in JavaScript
    // The function itself is added to the context by the caller
    // For function declarations in JEON format like {"function(a,b)": [...]}
    if (Array.isArray(operands) && operands.length === 2) {
        const [params, body] = operands
        // Create the function but don't return it - function declarations evaluate to undefined
        const func = function (...args: any[]) {
            // Create a new context with the parameters
            const functionContext = { ...context }
            if (Array.isArray(params)) {
                params.forEach((param: string, index: number) => {
                    functionContext[param] = args[index]
                })
            }

            // Evaluate the function body with the new context
            if (Array.isArray(body)) {
                let result: any
                for (const stmt of body) {
                    result = evalJeon(stmt, functionContext)

                    // If this is a return statement, return its value immediately
                    if (stmt && typeof stmt === 'object' && !Array.isArray(stmt) && 'return' in stmt) {
                        return evalJeon(stmt['return'], functionContext)
                    }
                }
                return result
            } else {
                // Single statement body
                return evalJeon(body, functionContext)
            }
        }
        // Function declarations evaluate to undefined in JavaScript
        return undefined
    }
    return undefined
}

// Handle async function declarations
export function evaluateAsyncFunction(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length === 2) {
        const [params, body] = operands
        return async function (...args: any[]) {
            // Create a new context with the parameters
            const functionContext = { ...context }
            if (Array.isArray(params)) {
                params.forEach((param: string, index: number) => {
                    functionContext[param] = args[index]
                })
            }

            // Evaluate the function body with the new context
            if (Array.isArray(body)) {
                let result: any
                for (const stmt of body) {
                    result = evalJeon(stmt, functionContext)

                    // If this is a return statement, return its value immediately
                    if (stmt && typeof stmt === 'object' && !Array.isArray(stmt) && 'return' in stmt) {
                        return evalJeon(stmt['return'], functionContext)
                    }
                }
                return result
            } else {
                // Single statement body
                return evalJeon(body, functionContext)
            }
        }
    }
    return async function () { return undefined }
}

// Handle generator function declarations
export function evaluateGeneratorFunction(operands: any, context: Record<string, any>): any {
    if (Array.isArray(operands) && operands.length === 2) {
        const [params, body] = operands
        return function* (...args: any[]) {
            // Create a new context with the parameters
            const functionContext = { ...context }
            if (Array.isArray(params)) {
                params.forEach((param: string, index: number) => {
                    functionContext[param] = args[index]
                })
            }

            // Evaluate the function body with the new context
            if (Array.isArray(body)) {
                for (const stmt of body) {
                    const result = evalJeon(stmt, functionContext)

                    // Handle yield statements
                    if (stmt && typeof stmt === 'object' && !Array.isArray(stmt) && 'yield' in stmt) {
                        yield result
                    }
                    // Handle return statements
                    else if (stmt && typeof stmt === 'object' && !Array.isArray(stmt) && 'return' in stmt) {
                        return result
                    }
                }
            }
        }
    }
    return function* () { return undefined }
}

// Handle arrow functions - OLD FORMAT: {"=>": [ [parameters], [body] ]}
// This is kept for backward compatibility with the switch statement case
export function evaluateArrowFunction(operands: any, context: Record<string, any>): any {
    // The correct structure is [ [parameters], [body statements] ]
    if (Array.isArray(operands) && operands.length === 2) {
        const [params, body] = operands  // Fixed: params comes first, then body
        return function (...args: any[]) {
            // Create a new context with the parameters
            const functionContext = { ...context }
            if (Array.isArray(params)) {
                params.forEach((param: string, index: number) => {
                    functionContext[param] = args[index]
                })
            }

            // Evaluate the function body with the new context
            if (Array.isArray(body)) {
                let result: any
                for (const stmt of body) {
                    result = evalJeon(stmt, functionContext)

                    // If this is a return statement, return its value immediately
                    if (stmt && typeof stmt === 'object' && !Array.isArray(stmt) && 'return' in stmt) {
                        const returnValue = evalJeon(stmt['return'], functionContext)
                        return returnValue
                    }
                }
                return result
            } else {
                // Single statement body
                const result = evalJeon(body, functionContext)
                return result
            }
        }
    }
    return function () { return undefined }
}