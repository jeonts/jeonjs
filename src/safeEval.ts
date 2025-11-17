import { jeon2js } from './jeon2js'
import { JeonExpression, JeonOperatorMap, JeonObject } from './JeonExpression'

/**
 * Safe context object that serves as fallback for variable lookup.
 * This provides a safe set of variables and functions.
 * Default includes safe built-in objects that don't pose XSS risks.
 * 
 * This object is frozen to prevent external modifications that could
 * introduce security vulnerabilities.
 */
export const safeContext: Record<string, any> = Object.freeze({
    // Safe Math operations
    Math: Object.freeze(Math),

    // Safe type checking and conversion
    Number: Number,
    String: String,
    Boolean: Boolean,
    Array: Array,
    Object: Object,
    Date: Date,

    // Safe utility functions
    isNaN: isNaN,
    isFinite: isFinite,
    parseInt: parseInt,
    parseFloat: parseFloat,

    // Safe JSON operations
    JSON: Object.freeze(JSON),

    // Safe constants
    undefined: undefined,
    null: null,
    true: true,
    false: false,
    Infinity: Infinity,
    NaN: NaN,

    console: Object.freeze(console)
})

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
            // Reject shortcuts like @this.name - must use explicit { '.': ['@this', 'name'] }
            if (cleanName.includes('.')) {
                throw new Error(`Invalid reference '${jeon}': member access shortcuts not allowed. Use explicit '.' operator: { ".": ["@${cleanName.split('.')[0]}", ...] }`)
            }
            // Return value from context, or fallback to safeContext, or undefined if not found
            return context[cleanName] ?? safeContext[cleanName]
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
        // Special handling: if any statement is a return, return its value immediately
        for (let i = 0; i < jeon.length; i++) {
            const item = jeon[i]
            const result = evalJeon(item, context)

            // If this is a return statement, return its value immediately
            // Check if the original item was a return statement object
            if (item && typeof item === 'object' && !Array.isArray(item) && item['return'] !== undefined) {
                return result
            }

            // If this is the last item, return its result
            if (i === jeon.length - 1) {
                return result
            }
        }

        // Fallback return (should not be reached)
        return undefined
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
                    } else if (operands !== undefined) {
                        // Handle unary minus
                        return -evalJeon(operands, context)
                    }
                    break

                case '+':
                    if (Array.isArray(operands)) {
                        if (operands.length === 1) {
                            return +evalJeon(operands[0], context)
                        } else if (operands.length >= 2) {
                            // Handle multiple operands for addition
                            return operands.reduce((acc, curr) =>
                                evalJeon(acc, context) + evalJeon(curr, context)
                            )
                        }
                    } else if (operands !== undefined) {
                        // Handle unary plus
                        return +evalJeon(operands, context)
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
                    if (operands !== undefined) {
                        // Handle unary logical NOT
                        return !evalJeon(operands, context)
                    }
                    break

                case '~':
                    if (operands !== undefined) {
                        // Handle unary bitwise NOT
                        return ~evalJeon(operands, context)
                    }
                    break

                case 'typeof':
                    if (operands !== undefined) {
                        // Handle typeof operator
                        return typeof evalJeon(operands, context)
                    }
                    break

                case '/ /':
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
                        else {
                            // Get function name for better error message
                            const funcName = jeon2js(operands[0])
                            throw new Error(`Cannot call non-function '${funcName}': ${typeof funcRef === 'object' ? 'object' : funcRef}`)
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
                    // Function declarations are handled by the special case outside the switch
                    // This case is for the 'function' operator in expressions
                    // For function declarations in JEON format like {"function(a,b)": [...]}
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

                        // Reject shortcuts like @this.name - must use explicit { '.': ['@this', 'name'] }
                        if (varName.includes('.')) {
                            throw new Error(`Invalid assignment target '@${varName}': member access shortcuts not allowed. Use explicit '.' operator: { ".": ["@${varName.split('.')[0]}", ...] }`)
                        }

                        // Handle simple variable assignment
                        context[varName] = value
                        return value
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

        // Check for named function declarations (e.g., "function sum(a,b)")
        const functionDeclarationKey = keys.find(key => key.startsWith('function'))
        if (functionDeclarationKey) {
            // Extract function name and parameters from the key
            // The key format is like "function name(param1, param2)" or "function(param1, param2)"
            const nameMatch = functionDeclarationKey.match(/function\s*(?:\w*\s*)?\(([^)]*)\)/)
            const paramStr = nameMatch ? nameMatch[1] : ''
            const params = paramStr ? paramStr.split(',').map(p => p.trim()).filter(p => p) : []
            const body = (jeon as any)[functionDeclarationKey]

            // Create and return a JavaScript function
            return function (...args: any[]) {
                // Create a new context with the parameters
                const functionContext = { ...context }
                params.forEach((param, index) => {
                    functionContext[param] = args[index]
                })

                // Evaluate the function body with the new context
                // The body is an array of statements
                if (Array.isArray(body)) {
                    let result
                    for (const stmt of body) {
                        result = evalJeon(stmt, functionContext)

                        // If this is a return statement, return its value immediately
                        if (stmt && typeof stmt === 'object' && !Array.isArray(stmt) && stmt['return'] !== undefined) {
                            return result
                        }
                    }
                    return result
                } else {
                    // Single statement body
                    return evalJeon(body, functionContext)
                }
            }
        }

        // Check for async function declarations (e.g., "async function fetchData()")
        const asyncFunctionDeclarationKey = keys.find(key => key.startsWith('async function '))
        if (asyncFunctionDeclarationKey) {
            // Extract function name and parameters from the key
            const nameMatch = asyncFunctionDeclarationKey.match(/async function (\w+)\(([^)]*)\)/)
            if (nameMatch) {
                const funcName = nameMatch[1]
                const paramStr = nameMatch[2]
                const params = paramStr ? paramStr.split(',').map(p => p.trim()).filter(p => p) : []
                const body = (jeon as any)[asyncFunctionDeclarationKey]

                // Create and return an async JavaScript function
                return async function (...args: any[]) {
                    // Create a new context with the parameters
                    const functionContext = { ...context }
                    params.forEach((param, index) => {
                        functionContext[param] = args[index]
                    })

                    // Evaluate the function body with the new context
                    // The body is an array of statements
                    if (Array.isArray(body)) {
                        let result
                        for (const stmt of body) {
                            result = evalJeon(stmt, functionContext)

                            // If this is a return statement, return its value immediately
                            if (stmt && typeof stmt === 'object' && !Array.isArray(stmt) && stmt['return'] !== undefined) {
                                return result
                            }
                        }
                        return result
                    } else {
                        // Single statement body
                        return evalJeon(body, functionContext)
                    }
                }
            }
        }

        // Handle array literals (special case where key is "[")
        if (keys.length === 1 && keys[0] === '[') {
            const arrayItems = (jeon as JeonObject)['[']
            if (Array.isArray(arrayItems)) {
                // Process array items, handling spread operators
                const result: any[] = []
                for (const item of arrayItems) {
                    if (typeof item === 'object' && item !== null && !Array.isArray(item) && '...' in item) {
                        // Handle spread operator
                        const spreadValue = evalJeon(item['...'], context)
                        if (Array.isArray(spreadValue)) {
                            result.push(...spreadValue)
                        } else {
                            result.push(spreadValue)
                        }
                    } else {
                        result.push(evalJeon(item, context))
                    }
                }
                return result
            }
        }

        // Handle variable declarations (@ for let/var, @@ for const)
        if (keys.length === 1 && (keys[0] === '@' || keys[0] === '@@')) {
            const declarations = (jeon as JeonObject)[keys[0]]
            if (typeof declarations === 'object' && declarations !== null) {
                // Process each variable declaration
                for (const [varName, valueExpr] of Object.entries(declarations)) {
                    // For uninitialized variables (represented by @undefined sentinel), set to undefined
                    const value = valueExpr === '@undefined' ? undefined : evalJeon(valueExpr, context)
                    context[varName] = value
                }
            }
            // Variable declaration statements return undefined in JavaScript
            return undefined
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