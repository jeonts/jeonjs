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

        // For plain identifiers (not starting with @), check if they exist in context or safeContext
        if (context[jeon] !== undefined) {
            return context[jeon]
        }

        if (safeContext[jeon] !== undefined) {
            return safeContext[jeon]
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

            // If this is a function declaration (regular or generator), 
            // add it to the context so it's available for subsequent statements
            // but don't evaluate the body immediately
            if (item && typeof item === 'object' && !Array.isArray(item)) {
                const keys = Object.keys(item)
                const functionDeclarationKey = keys.find(key => key.startsWith('function') || key.startsWith('function*'))
                if (functionDeclarationKey) {
                    // Extract function name from the key
                    const nameMatch = functionDeclarationKey.match(/function\*?\s+(\w+)/)
                    if (nameMatch) {
                        const functionName = nameMatch[1]
                        // Create the function without evaluating its body immediately
                        const functionResult = evalJeon(item, context)
                        context[functionName] = functionResult

                        // If this is the last item, return its result
                        if (i === jeon.length - 1) {
                            return functionResult
                        }
                        continue // Skip normal evaluation for function declarations
                    }
                }

                // If this is a class declaration, add it to the context so it's available for subsequent statements
                const classDeclarationKey = keys.find(key => key.startsWith('class '))
                if (classDeclarationKey) {
                    // Extract class name from the key
                    const classNameMatch = classDeclarationKey.match(/class\s+(\w+)/)
                    if (classNameMatch) {
                        const className = classNameMatch[1]
                        const classResult = evalJeon(item, context)
                        context[className] = classResult

                        // If this is the last item, return its result
                        if (i === jeon.length - 1) {
                            return classResult
                        }
                        continue // Skip normal evaluation for class declarations
                    }
                }
            }

            // Normal evaluation for non-declaration items
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

        // Check for class declarations (e.g., "class Person")
        const classDeclarationKey = keys.find(key => key.startsWith('class '))
        if (classDeclarationKey) {
            // Extract class name from the key
            const classNameMatch = classDeclarationKey.match(/class\s+(\w+)/)
            if (classNameMatch) {
                const className = classNameMatch[1]
                const classDef = (jeon as any)[classDeclarationKey]

                // Create a class constructor that uses evalJeon internally
                const ClassConstructor = function (this: any, ...args: any[]) {
                    // Find constructor in class definition
                    const constructorKey = Object.keys(classDef).find(key => key.startsWith('constructor'))
                    if (constructorKey) {
                        const constructorBody = classDef[constructorKey]

                        // Extract parameter names from constructor signature
                        const paramMatch = constructorKey.match(/\(([^)]*)\)/)
                        const params: string[] = paramMatch ? paramMatch[1].split(',').map((p: string) => p.trim()).filter((p: string) => p) : []

                        // Create context with parameters and 'this'
                        const constructorContext: any = { this: this }
                        params.forEach((param: string, index: number) => {
                            constructorContext[param] = args[index]
                        })

                        // Execute constructor body statements with evalJeon
                        if (Array.isArray(constructorBody)) {
                            for (const statement of constructorBody) {
                                evalJeon(statement, constructorContext)
                            }
                        }
                    }
                }

                // Add methods to prototype
                const methodKeys = Object.keys(classDef).filter(key => key.includes('(') && !key.startsWith('constructor'))
                methodKeys.forEach(methodKey => {
                    const methodName = methodKey.split('(')[0]
                    const methodBody = classDef[methodKey]

                    // Extract method parameters
                    const methodParamMatch = methodKey.match(/\(([^)]*)\)/)
                    let methodParams: string[] = []
                    if (methodParamMatch && methodParamMatch[1]) {
                        methodParams = methodParamMatch[1].split(',').map((p: string) => p.trim()).filter((p: string) => p)
                    }

                    // Create method function
                    (ClassConstructor as any).prototype[methodName] = function (this: any, ...args: any[]) {
                        // Create context with parameters and 'this'
                        const methodContext: any = { this: this }
                        methodParams.forEach((param: string, index: number) => {
                            methodContext[param] = args[index]
                        })

                        // Execute method body statements with evalJeon
                        if (Array.isArray(methodBody)) {
                            let result: any
                            for (const statement of methodBody) {
                                result = evalJeon(statement, methodContext)

                                // Handle return statements
                                if (statement && typeof statement === 'object' && !Array.isArray(statement) && statement['return'] !== undefined) {
                                    return result
                                }
                            }
                            return result
                        }
                    }
                })

                // Add class to context so it can be used
                context[className] = ClassConstructor

                // Return the class constructor
                return ClassConstructor
            }
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
                            // For property names, we should treat them as literals, not variable references
                            // So we don't use evalJeon directly on them
                            let prop: string
                            const propOperand = operands[i]
                            if (typeof propOperand === 'string') {
                                // If it's a string starting with @, it's a variable reference
                                if (propOperand.startsWith('@')) {
                                    const cleanName = propOperand.substring(1)
                                    prop = context[cleanName] ?? safeContext[cleanName]
                                } else {
                                    // Otherwise, treat it as a literal property name
                                    prop = propOperand
                                }
                            } else {
                                // For non-string operands, evaluate them normally
                                prop = evalJeon(propOperand, context)
                            }

                            if (result && typeof result === 'object' && prop in result) {
                                result = result[prop]
                                // If this is a method (function) and we're accessing it from an object,
                                // bind the object as 'this' context
                                if (typeof result === 'function' && i === operands.length - 1) {
                                    result = result.bind(obj)
                                }
                            } else {
                                // If we can't access the property, return undefined
                                return undefined
                            }
                        }
                        return result
                    }
                    break
                // Handle sequence expressions (comma operator)
                case ',':
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
                    break

                // Handle new operator
                case 'new':
                    if (Array.isArray(operands) && operands.length >= 1) {
                        const constructor = evalJeon(operands[0], context)
                        const args = operands.slice(1).map(arg => evalJeon(arg, context))
                        // Handle constructor with different argument counts
                        // Use Reflect.construct or Function.prototype.apply for proper instantiation
                        return new constructor(...args)
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
                        } else if (typeof varNameExpr === 'string') {
                            varName = varNameExpr
                        } else {
                            varName = evalJeon(varNameExpr, context) as string
                        }

                        // Handle property assignment like { '.': ['@this', 'name'] }
                        if (varNameExpr && typeof varNameExpr === 'object' && !Array.isArray(varNameExpr) && '.' in varNameExpr) {
                            // This is a property assignment like this.name = value
                            const propAccessExpr = varNameExpr['.'] as any[]
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
                    break

                // Handle return statement
                case 'return':
                    return evalJeon(operands, context)

                // Handle yield statement
                case 'yield':
                    // Yield statements are handled within generator functions
                    // This case should not be reached in normal evaluation
                    throw new Error('yield can only be used inside generator functions')

                // Handle yield* statement
                case 'yield*':
                    // Yield* statements are handled within generator functions
                    // This case should not be reached in normal evaluation
                    throw new Error('yield* can only be used inside generator functions')

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

                case '++':
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
                        const currentValue = context[varName] ?? safeContext[varName] ?? 0
                        const newValue = currentValue + 1
                        context[varName] = newValue
                        // For postfix increment (i++), we should return the original value
                        // Since we don't distinguish between postfix and prefix in JEON,
                        // we'll assume it's postfix and return the original value
                        return currentValue
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
                // The body is an array of statements
                if (Array.isArray(body)) {
                    // Create a generator that can handle nested control structures
                    return createGeneratorFromStatements(body, functionContext)
                } else {
                    // Single statement body
                    return evalJeon(body, functionContext)
                }
            }
        }

        // Check for named function declarations (e.g., "function sum(a,b)")
        const functionDeclarationKey = keys.find(key => key.startsWith('function') && !key.startsWith('function*'))
        if (functionDeclarationKey) {
            // Extract function name and parameters from the key
            // The key format is like "function name(param1, param2)" or "function(param1, param2)"
            let paramStr = ''
            const nameMatch = functionDeclarationKey.match(/function\s+(\w+)\s*\(([^)]*)\)/)
            if (nameMatch) {
                const funcName = nameMatch[1]
                paramStr = nameMatch[2]
            } else {
                // Handle anonymous function case
                const anonMatch = functionDeclarationKey.match(/function\s*\(([^)]*)\)/)
                if (anonMatch) {
                    paramStr = anonMatch[1]
                }
            }
            const params = paramStr ? paramStr.split(',').map((p: string) => p.trim()).filter((p: string) => p) : []
            const body = (jeon as any)[functionDeclarationKey]

            // Create and return a JavaScript function
            return function (...args: any[]) {
                // Create a new context with the parameters
                const functionContext = { ...context }
                params.forEach((param: string, index: number) => {
                    functionContext[param] = args[index]
                })

                // Evaluate the function body with the new context
                // The body is an array of statements
                if (Array.isArray(body)) {
                    let result: any
                    for (const stmt of body) {
                        result = evalJeon(stmt, functionContext)

                        // If this is a return statement, return its value immediately
                        if (stmt && typeof stmt === 'object' && !Array.isArray(stmt) && stmt['return'] !== undefined) {
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

        // Check for generator function declarations (e.g., "function* countUpTo(max)")
        const generatorFunctionDeclarationKey = keys.find(key => key.startsWith('function*'))
        if (generatorFunctionDeclarationKey) {
            // Extract function name and parameters from the key
            const nameMatch = generatorFunctionDeclarationKey.match(/function\* (\w+)\(([^)]*)\)/)
            if (nameMatch) {
                const funcName = nameMatch[1]
                const paramStr = nameMatch[2]
                const params = paramStr ? paramStr.split(',').map(p => p.trim()).filter(p => p) : []
                const body = (jeon as any)[generatorFunctionDeclarationKey]

                // Create and return a generator function
                // We'll simulate generator behavior by returning an iterator object
                return function* (...args: any[]) {
                    // Create a new context with the parameters
                    const functionContext = { ...context }
                    params.forEach((param, index) => {
                        functionContext[param] = args[index]
                    })

                    // Evaluate the function body with the new context
                    // The body is an array of statements
                    if (Array.isArray(body)) {
                        // Create a generator that can handle nested control structures
                        return yield* createGeneratorFromStatements(body, functionContext)
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
                        // Check if spreadValue is an iterable (like a generator)
                        if (spreadValue && typeof spreadValue[Symbol.iterator] === 'function') {
                            // Consume the iterator and push all values
                            for (const value of spreadValue) {
                                result.push(value)
                            }
                        } else if (Array.isArray(spreadValue)) {
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
                // Check if this is a destructuring assignment by looking for the special _destructuring_source key
                if ('_destructuring_source' in declarations) {
                    // This is a destructuring assignment
                    const sourceExpr = declarations['_destructuring_source']
                    const sourceValue = sourceExpr ? evalJeon(sourceExpr, context) : {}
                    
                    // Process each variable declaration
                    for (const [varName, valueExpr] of Object.entries(declarations)) {
                        if (varName === '_destructuring_source') {
                            // Skip the source expression
                            continue
                        }
                        
                        // Check if this is a destructured property (marked with @[propName])
                        if (typeof valueExpr === 'string' && valueExpr.startsWith('@[') && valueExpr.endsWith(']')) {
                            // Extract the property name from the marker
                            const propName = valueExpr.substring(2, valueExpr.length - 1)
                            // Get the value from the source object
                            const value = sourceValue && typeof sourceValue === 'object' && propName in sourceValue 
                                ? sourceValue[propName] 
                                : undefined
                            context[varName] = value
                        } else {
                            // Regular variable assignment
                            const value = valueExpr === '@undefined' ? undefined : evalJeon(valueExpr, context)
                            context[varName] = value
                        }
                    }
                } else {
                    // Regular variable declarations
                    for (const [varName, valueExpr] of Object.entries(declarations)) {
                        // For uninitialized variables (represented by @undefined sentinel), set to undefined
                        const value = valueExpr === '@undefined' ? undefined : evalJeon(valueExpr, context)
                        context[varName] = value
                    }
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

// Helper function to process statements within generator functions
function processStatementInGenerator(stmt: any, context: Record<string, any>) {
    // This function is called from within a generator function context
    // We need to handle yield statements specially

    // Check if this is a yield statement
    if (stmt && typeof stmt === 'object' && !Array.isArray(stmt) && 'yield' in stmt) {
        const yieldValue = evalJeon(stmt['yield'], context)
        // In a real generator, we would yield here, but since this is a helper function,
        // we need to handle this differently
        throw new Error('Yield statement encountered in non-generator context')
    } else if (stmt && typeof stmt === 'object' && !Array.isArray(stmt) && 'yield*' in stmt) {
        // Handle yield* (delegating yield)
        const iterable = evalJeon(stmt['yield*'], context)
        if (iterable && typeof iterable[Symbol.iterator] === 'function') {
            // In a real generator, we would yield* here
            throw new Error('Yield* statement encountered in non-generator context')
        }
    } else if (stmt && typeof stmt === 'object' && !Array.isArray(stmt) && 'return' in stmt) {
        // Handle return statement
        const returnValue = evalJeon(stmt['return'], context)
        return returnValue
    } else {
        // For other statements, evaluate normally
        evalJeon(stmt, context)
    }
}

// Helper function to process statements in while loops within generator functions
function processStatementInWhileLoop(stmt: any, context: Record<string, any>) {
    // This is a simplified approach - in reality, we'd need a more complex solution
    // For now, we'll just evaluate the statement normally
    evalJeon(stmt, context)
}

// Helper function to create a generator from statements
function* createGeneratorFromStatements(statements: any[], context: Record<string, any>): Generator<any, any, any> {
    for (const stmt of statements) {
        // Check if this is a yield statement
        if (stmt && typeof stmt === 'object' && !Array.isArray(stmt) && 'yield' in stmt) {
            const yieldValue = evalJeon(stmt['yield'], context)
            yield yieldValue
        } else if (stmt && typeof stmt === 'object' && !Array.isArray(stmt) && 'yield*' in stmt) {
            // Handle yield* (delegating yield)
            const iterable = evalJeon(stmt['yield*'], context)
            if (iterable && typeof iterable[Symbol.iterator] === 'function') {
                for (const value of iterable) {
                    yield value
                }
            }
        } else if (stmt && typeof stmt === 'object' && !Array.isArray(stmt) && 'return' in stmt) {
            // Handle return statement
            const returnValue = evalJeon(stmt['return'], context)
            return returnValue
        } else {
            // For other statements, we need to be careful about nested control structures
            // that might contain yield
            if (stmt && typeof stmt === 'object' && !Array.isArray(stmt)) {
                const stmtKeys = Object.keys(stmt)
                if (stmtKeys.length === 1) {
                    const op = stmtKeys[0]
                    const operands = (stmt as any)[op]

                    // Handle control structures that might contain yield
                    if (op === 'while' && Array.isArray(operands) && operands.length === 2) {
                        // For while loops, we need to manually iterate and check for yields
                        while (evalJeon(operands[0], context)) {
                            // Process the loop body statement by statement
                            // The body might be a single statement or an array of statements
                            if (Array.isArray(operands[1])) {
                                yield* createGeneratorFromStatements(operands[1], context)
                            } else {
                                // Single statement
                                yield* createGeneratorFromStatements([operands[1]], context)
                            }
                        }
                    } else if (op === 'if' && Array.isArray(operands) && (operands.length === 2 || operands.length === 3)) {
                        const condition = evalJeon(operands[0], context)
                        if (condition) {
                            // Process the if body statement by statement
                            // The body might be a single statement or an array of statements
                            if (Array.isArray(operands[1])) {
                                yield* createGeneratorFromStatements(operands[1], context)
                            } else {
                                // Single statement
                                yield* createGeneratorFromStatements([operands[1]], context)
                            }
                        } else if (operands.length === 3) {
                            // Process the else body statement by statement
                            // The body might be a single statement or an array of statements
                            if (Array.isArray(operands[2])) {
                                yield* createGeneratorFromStatements(operands[2], context)
                            } else {
                                // Single statement
                                yield* createGeneratorFromStatements([operands[2]], context)
                            }
                        }
                    } else {
                        // For other operators, evaluate normally
                        evalJeon(stmt, context)
                    }
                } else {
                    // For complex objects, evaluate normally
                    evalJeon(stmt, context)
                }
            } else {
                // For primitives and arrays, evaluate normally
                evalJeon(stmt, context)
            }
        }
    }
}
