import { jeon2js } from '../jeon2js'
import { JeonExpression, JeonOperatorMap, JeonObject } from '../JeonExpression'

/**
 * Evaluates a JEON expression directly without converting to JavaScript.
 * This function interprets JEON structures representing expressions and computes their values.
 * @param jeon The JEON expression to evaluate.
 * @param context Optional context object with variable values.
 * @returns The result of the expression evaluation.
 */
export function evalJeon(jeon: JeonExpression, context: Record<string, any> = {}): any {
    // Handle primitives
    if (typeof jeon === 'string') {

        if (jeon.startsWith('@')) {
            const cleanName = jeon.substring(1)
            // Handle nested property access like "@this.name"
            if (cleanName.includes('.')) {
                const parts = cleanName.split('.')
                let value = context
                for (const part of parts) {
                    if (value && typeof value === 'object' && part in value) {
                        value = value[part]
                    } else {
                        return jeon // Return original if not found
                    }
                }
                return value
            }
            // Handle simple variable references
            else if (cleanName in context) {
                return context[cleanName]
            }
        }
        return jeon
    }

    if (typeof jeon === 'number' || typeof jeon === 'boolean' || jeon === null) {
        return jeon
    }

    // Handle arrays
    if (Array.isArray(jeon)) {
        // For arrays representing function bodies or statement sequences,
        // evaluate all statements and return the result of the last one
        const results = jeon.map(item => evalJeon(item, context))
        // Return the last result (important for function bodies)
        return results[results.length - 1]
    }

    // Handle objects
    if (typeof jeon === 'object' && jeon !== null) {
        const keys = Object.keys(jeon)

        // Handle empty object
        if (keys.length === 0) {
            return {}
        }

        // Handle single-key objects (operators, etc.)
        if (keys.length === 1) {
            const op = keys[0] as keyof JeonOperatorMap
            const operands = jeon[op]

            // Handle arithmetic and comparison operators
            switch (op) {
                case '+':
                    if (Array.isArray(operands) && operands.length >= 2) {
                        return operands.reduce((acc, curr) =>
                            evalJeon(acc, context) + evalJeon(curr, context)
                        )
                    }
                    break

                case '-':
                    if (Array.isArray(operands)) {
                        if (operands.length === 1) {
                            return -evalJeon(operands[0], context)
                        } else if (operands.length >= 2) {
                            return operands.slice(1).reduce(
                                (acc, curr) => acc - evalJeon(curr, context),
                                evalJeon(operands[0], context)
                            )
                        }
                    }
                    break

                case '*':
                    if (Array.isArray(operands) && operands.length >= 2) {
                        return operands.reduce((acc, curr) =>
                            evalJeon(acc, context) * evalJeon(curr, context)
                        )
                    }
                    break

                case '/':
                    if (Array.isArray(operands) && operands.length >= 2) {
                        return operands.slice(1).reduce(
                            (acc, curr) => acc / evalJeon(curr, context),
                            evalJeon(operands[0], context)
                        )
                    }
                    break

                case '%':
                    if (Array.isArray(operands) && operands.length >= 2) {
                        return operands.slice(1).reduce(
                            (acc, curr) => acc % evalJeon(curr, context),
                            evalJeon(operands[0], context)
                        )
                    }
                    break

                case '==':
                    if (Array.isArray(operands) && operands.length === 2) {
                        return evalJeon(operands[0], context) == evalJeon(operands[1], context)
                    }
                    break

                case '===':
                    if (Array.isArray(operands) && operands.length === 2) {
                        return evalJeon(operands[0], context) === evalJeon(operands[1], context)
                    }
                    break

                case '!=':
                    if (Array.isArray(operands) && operands.length === 2) {
                        return evalJeon(operands[0], context) != evalJeon(operands[1], context)
                    }
                    break

                case '!==':
                    if (Array.isArray(operands) && operands.length === 2) {
                        return evalJeon(operands[0], context) !== evalJeon(operands[1], context)
                    }
                    break

                case '<':
                    if (Array.isArray(operands) && operands.length === 2) {
                        return evalJeon(operands[0], context) < evalJeon(operands[1], context)
                    }
                    break

                case '>':
                    if (Array.isArray(operands) && operands.length === 2) {
                        return evalJeon(operands[0], context) > evalJeon(operands[1], context)
                    }
                    break

                case '<=':
                    if (Array.isArray(operands) && operands.length === 2) {
                        return evalJeon(operands[0], context) <= evalJeon(operands[1], context)
                    }
                    break

                case '>=':
                    if (Array.isArray(operands) && operands.length === 2) {
                        return evalJeon(operands[0], context) >= evalJeon(operands[1], context)
                    }
                    break

                case '&&':
                    if (Array.isArray(operands) && operands.length >= 2) {
                        return operands.every(operand => evalJeon(operand, context))
                    }
                    break

                case '||':
                    if (Array.isArray(operands) && operands.length >= 2) {
                        return operands.some(operand => evalJeon(operand, context))
                    }
                    break

                case '!':
                    return !evalJeon(operands, context)

                case '(':
                    // Handle parentheses - just evaluate the contents
                    return evalJeon(operands, context)

                case '?':
                    if (Array.isArray(operands) && operands.length === 3) {
                        const condition = evalJeon(operands[0], context)
                        return condition ?
                            evalJeon(operands[1], context) :
                            evalJeon(operands[2], context)
                    }
                    break

                // Handle function calls
                case '()':
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
                    }
                    break

                // Handle property access
                case '.':
                    if (Array.isArray(operands) && operands.length >= 2) {
                        // The first operand is the object, the rest are property names
                        const obj = evalJeon(operands[0], context)

                        // Chain property access
                        let result = obj
                        for (let i = 1; i < operands.length; i++) {
                            const prop = evalJeon(operands[i], context)
                            if (result && typeof result === 'object' && prop in result) {
                                result = result[prop]
                            } else {
                                // If we can't access the property, return undefined
                                return undefined
                            }
                        }
                        return result
                    }
                    break

                // Handle new operator
                case 'new':
                    if (Array.isArray(operands) && operands.length >= 1) {
                        const constructor = evalJeon(operands[0], context)
                        const args = operands.slice(1).map(arg => evalJeon(arg, context))
                        // Handle constructor with different argument counts
                        if (args.length === 0) {
                            return new constructor()
                        } else if (args.length === 1) {
                            return new constructor(args[0])
                        } else {
                            // For multiple arguments, we need to call the constructor properly
                            // Using apply to handle the arguments array
                            const argsArray: any[] = [null, ...args]
                            return new (Function.prototype.bind as any)(constructor, ...argsArray)()
                        }
                    }
                    break

                // Handle spread operator
                case '...':
                    // The spread operator is typically used in array or object contexts
                    // For evaluation purposes, we just return the value
                    return evalJeon(operands, context)

                // Handle function declarations
                case 'function':
                    // This would be a function declaration, but for evaluation we return a function
                    // In a real implementation, we would need to parse and create a function
                    // For now, we'll just return a placeholder
                    return function () { return undefined }

                // Handle async function declarations
                case 'async function':
                    // This would be an async function declaration
                    // For now, we'll just return a placeholder async function
                    return async function () { return undefined }

                // Handle arrow functions
                case '=>':
                    // This would be an arrow function
                    // For now, we'll just return a placeholder
                    return function () { return undefined }

                // Handle variable assignment
                case '=':
                    if (Array.isArray(operands) && operands.length === 2) {
                        // For assignment, the first operand should be the variable name (not evaluated)
                        // The second operand should be the value (evaluated)
                        const varNameExpr = operands[0]
                        const value = evalJeon(operands[1], context)

                        // Get the variable name as a string
                        let varName: string
                        if (typeof varNameExpr === 'string' && varNameExpr.startsWith('@')) {
                            varName = varNameExpr.substring(1) // Remove the '@' prefix
                        } else {
                            varName = evalJeon(varNameExpr, context) as string
                        }

                        // Handle nested property assignment like "this.name"
                        if (varName.includes('.')) {
                            const parts = varName.split('.')
                            let obj = context
                            // Navigate to the parent object
                            for (let i = 0; i < parts.length - 1; i++) {
                                if (obj && typeof obj === 'object' && parts[i] in obj) {
                                    obj = obj[parts[i]]
                                } else {
                                    // If we can't navigate, return undefined
                                    return undefined
                                }
                            }
                            // Set the property on the parent object
                            const prop = parts[parts.length - 1]
                            obj[prop] = value
                            return value
                        } else {
                            // Handle simple variable assignment
                            context[varName] = value
                            return value
                        }
                    }
                    break

                // Handle return statement
                case 'return':
                    return evalJeon(operands, context)

                // Handle if statements
                case 'if':
                    if (Array.isArray(operands) && (operands.length === 2 || operands.length === 3)) {
                        const condition = evalJeon(operands[0], context)
                        if (condition) {
                            return evalJeon(operands[1], context)
                        } else if (operands.length === 3) {
                            return evalJeon(operands[2], context)
                        }
                    }
                    break

                // Handle while loops
                case 'while':
                    if (Array.isArray(operands) && operands.length === 2) {
                        let result
                        while (evalJeon(operands[0], context)) {
                            result = evalJeon(operands[1], context)
                        }
                        return result
                    }
                    break

                // Handle for loops
                case 'for':
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
                    break
            }
        }

        // Check for shorthand function call syntax (e.g., "abs()")
        const functionCallKey = keys.find(key => key.endsWith('()'))
        if (functionCallKey) {
            const functionName = functionCallKey.substring(0, functionCallKey.length - 2)
            const functionArgs = (jeon as any)[functionCallKey]

            // Try to resolve the function from context
            let func = context[functionName]

            // If not in context, try global scope (for built-in functions like Math.abs)
            if (!func && typeof globalThis !== 'undefined') {
                func = (globalThis as any)[functionName]
            }

            if (typeof func === 'function') {
                const args = Array.isArray(functionArgs)
                    ? functionArgs.map((arg: any) => evalJeon(arg, context))
                    : []
                return func(...args)
            }

            // If function not found, throw error
            throw new Error(`Function '${functionName}' is not defined in context or global scope`)
        }

        // Check for arrow function syntax (e.g., "(a, b) =>")
        const arrowFunctionKey = keys.find(key => key.includes('=>'))
        if (arrowFunctionKey) {
            // Extract parameter names from the key
            const paramMatch = arrowFunctionKey.match(/\(([^)]*)\)/)
            const params = paramMatch ? paramMatch[1].split(',').map(p => p.trim()).filter(p => p) : []
            const body = (jeon as any)[arrowFunctionKey]

            // Create and return a JavaScript function
            return function (...args: any[]) {
                // Create a new context with the parameters
                const functionContext = { ...context }
                params.forEach((param, index) => {
                    functionContext[param] = args[index]
                })

                // Evaluate the function body with the new context
                return evalJeon(body, functionContext)
            }
        }

        // Handle object literals
        const result: Record<string, any> = {}
        for (const key of keys) {
            result[key] = evalJeon((jeon as JeonObject)[key], context)
        }
        return result
    }

    // Fallback - return as is
    return jeon
}