import { JeonExpression, JeonOperatorMap, JeonObject } from './JeonExpression'

// Import all operator evaluation functions
import * as operatorEvaluator from './eval.jeon/operatorEvaluator'

/**
 * Helper function to assign function parameters to context, handling rest parameters.
 * @param params Array of parameter names (may include rest params like '...a')
 * @param args Array of actual arguments passed to the function
 * @param functionContext The context object to assign parameters to
 */
function assignParamsToContext(params: string[], args: any[], functionContext: Record<string, any>): void {
    let restParamIndex = -1
    let restParamName = ''
    
    // First pass: find rest parameter and assign regular params
    for (let i = 0; i < params.length; i++) {
        const param = params[i]
        if (param.startsWith('...')) {
            // This is a rest parameter - collect all remaining args
            restParamIndex = i
            restParamName = param.substring(3) // Remove '...' prefix
            functionContext[restParamName] = args.slice(i)
            break // Rest parameter must be last, no more regular params after this
        } else {
            functionContext[param] = args[i]
        }
    }
}

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
    Error: Error,
    RegExp: RegExp,
    Set: Set,
    Map: Map,
    Uint8Array: Uint8Array,
    URL: URL,
    URLSearchParams: URLSearchParams,
    Symbol: Symbol,

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
        // Check if this array should be treated as an array literal or a statement sequence
        // Use the same heuristic as the arrayVisitor in jeon2js
        const hasStatementObjects = jeon.some(item =>
            typeof item === 'object' && item !== null &&
            (Object.keys(item).some(key =>
                key.startsWith('function') || key.startsWith('async function') || key.startsWith('function*') ||
                key === '@' || key === '@@' ||
                key === 'if' || key === 'while' || key === 'for' ||
                key === 'switch' || key === 'try' || key === 'return' ||
                key === 'break' || key === 'continue' || key === 'throw' || key === 'debugger' ||
                key === 'class' || key === 'import' || key === 'export' ||
                key === '()' || key.endsWith('=>')
            )))

        // If it doesn't contain statement objects, treat it as an array literal
        if (!hasStatementObjects) {
            // Process array items as literal values
            const result: any[] = []
            for (const item of jeon) {
                if (item === '@undefined') {
                    // @undefined represents a sparse array hole
                    result.push(undefined) // or we could use null to represent holes
                } else if (item === '@@undefined') {
                    // @@undefined represents an explicit undefined in the array
                    result.push(undefined)
                } else if (typeof item === 'object' && item !== null && !Array.isArray(item) && '...' in item) {
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
                        console.log(`Processing function declaration: ${functionName}`)

                        // Create the function without evaluating its body immediately
                        // NOTE: We don't call evalJeon here because that would just return the function
                        // without adding it to context. Instead, we directly process the function declaration.

                        // Extract function name and parameters from the key
                        let paramStr = ''
                        const detailedNameMatch = functionDeclarationKey.match(/function\*?\s+(\w+)\s*\(([^)]*)\)/)
                        if (detailedNameMatch) {
                            paramStr = detailedNameMatch[2]
                        }
                        const params = paramStr ? paramStr.split(',').map((p: string) => p.trim()).filter((p: string) => p) : []
                        const body = (item as any)[functionDeclarationKey]

                        // Create the function
                        const functionResult = function (...args: any[]) {
                            console.log(`Calling function: ${functionName} with args:`, args)
                            // Create a new context with the parameters
                            // NOTE: We use the current context at call time, not at creation time
                            const functionContext: any = {}
                            // Copy all properties from the current context
                            for (const key in context) {
                                functionContext[key] = context[key]
                            }
                            // Add the parameters (handling rest params)
                            assignParamsToContext(params, args, functionContext)

                            // Evaluate the function body with the new context
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

                        context[functionName] = functionResult
                        console.log(`Added function ${functionName} to context`)
                        // Function declarations evaluate to undefined in JavaScript
                        if (i === jeon.length - 1) {
                            return undefined
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

                        // Class declarations evaluate to undefined in JavaScript
                        if (i === jeon.length - 1) {
                            return undefined
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

                        // Create context with parameters and 'this' (handling rest params)
                        const constructorContext: any = { this: this }
                        assignParamsToContext(params, args, constructorContext)

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
                    // Check if this is a static method
                    const isStatic = methodKey.startsWith('static ')
                    const actualMethodKey = isStatic ? methodKey.substring(7) : methodKey // Remove 'static ' prefix

                    const methodName = actualMethodKey.split('(')[0]
                    const methodBody = classDef[methodKey]

                    // Extract method parameters
                    const methodParamMatch = actualMethodKey.match(/\(([^)]*)\)/)
                    let methodParams: string[] = []
                    if (methodParamMatch && methodParamMatch[1]) {
                        methodParams = methodParamMatch[1].split(',').map((p: string) => p.trim()).filter((p: string) => p)
                    }

                    if (isStatic) {
                        // Create static method function
                        (ClassConstructor as any)[methodName] = function (...args: any[]) {
                            // Create context with parameters (no 'this' for static methods, handling rest params)
                            const methodContext: any = {}
                            assignParamsToContext(methodParams, args, methodContext)

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
                    } else {
                        // Create instance method function
                        (ClassConstructor as any).prototype[methodName] = function (this: any, ...args: any[]) {
                            // Create context with parameters and 'this' (handling rest params)
                            const methodContext: any = { this: this }
                            assignParamsToContext(methodParams, args, methodContext)

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
                    return operatorEvaluator.evaluateMinus(operands, context)

                case '+':
                    return operatorEvaluator.evaluatePlus(operands, context)

                case '*':
                    return operatorEvaluator.evaluateMultiply(operands, context)

                case '/':
                    return operatorEvaluator.evaluateDivide(operands, context)

                case '%':
                    return operatorEvaluator.evaluateModulo(operands, context)

                case '==':
                    return operatorEvaluator.evaluateEqual(operands, context)

                case '===':
                    return operatorEvaluator.evaluateStrictEqual(operands, context)

                case '!=':
                    return operatorEvaluator.evaluateNotEqual(operands, context)

                case '!==':
                    return operatorEvaluator.evaluateStrictNotEqual(operands, context)

                case '<':
                    return operatorEvaluator.evaluateLessThan(operands, context)

                case '>':
                    return operatorEvaluator.evaluateGreaterThan(operands, context)

                case '<=':
                    return operatorEvaluator.evaluateLessThanOrEqual(operands, context)

                case '>=':
                    return operatorEvaluator.evaluateGreaterThanOrEqual(operands, context)

                case '&&':
                    return operatorEvaluator.evaluateLogicalAnd(operands, context)

                case '||':
                    return operatorEvaluator.evaluateLogicalOr(operands, context)

                case '!':
                    return operatorEvaluator.evaluateLogicalNot(operands, context)

                case '~':
                    return operatorEvaluator.evaluateBitwiseNot(operands, context)

                case 'void':
                    return operatorEvaluator.evaluateVoid(operands, context)

                case 'delete':
                    return operatorEvaluator.evaluateDelete(operands, context)

                case '&':
                    return operatorEvaluator.evaluateBitwiseAnd(operands, context)

                case '|':
                    return operatorEvaluator.evaluateBitwiseOr(operands, context)

                case '^':
                    return operatorEvaluator.evaluateBitwiseXor(operands, context)

                case '<<':
                    return operatorEvaluator.evaluateLeftShift(operands, context)

                case '>>':
                    return operatorEvaluator.evaluateRightShift(operands, context)

                case '>>>':
                    return operatorEvaluator.evaluateUnsignedRightShift(operands, context)

                case 'typeof':
                    return operatorEvaluator.evaluateTypeof(operands, context)

                case '/ /':
                    return operatorEvaluator.evaluateRegex(operands, context)

                case '(':
                    return operatorEvaluator.evaluateParentheses(operands, context)

                case '?':
                    return operatorEvaluator.evaluateConditional(operands, context)

                // Handle function calls
                case '()':
                    return operatorEvaluator.evaluateFunctionCall(operands, context)

                // Handle property access
                case '.':
                    return operatorEvaluator.evaluatePropertyAccess(operands, context)

                // Handle bracket notation access
                case '[]':
                    return operatorEvaluator.evaluateBracketAccess(operands, context)

                // Handle sequence expressions (comma operator)
                case ',':
                    return operatorEvaluator.evaluateSequence(operands, context)

                // Handle new operator
                case 'new':
                    return operatorEvaluator.evaluateNew(operands, context)

                // Handle class expressions
                case 'class':
                    return operatorEvaluator.evaluateClass(operands, context)

                // Handle spread operator
                case '...':
                    return operatorEvaluator.evaluateSpread(operands, context)

                // Handle function declarations
                case 'function':
                    return operatorEvaluator.evaluateFunction(operands, context)

                // Handle async function declarations
                case 'async function':
                    return operatorEvaluator.evaluateAsyncFunction(operands, context)

                // Handle generator function declarations
                case 'function*':
                    return operatorEvaluator.evaluateGeneratorFunction(operands, context)

                // Handle arrow functions
                case '()=>':
                    return operatorEvaluator.evaluateArrowFunction(operands, context)

                // Handle variable assignment
                case '=':
                    return operatorEvaluator.evaluateAssignment(operands, context)

                case '+=':
                    return operatorEvaluator.evaluateAddAssignment(operands, context)

                case '-=':
                    return operatorEvaluator.evaluateSubtractAssignment(operands, context)

                case '*=':
                    return operatorEvaluator.evaluateMultiplyAssignment(operands, context)

                case '/=':
                    return operatorEvaluator.evaluateDivideAssignment(operands, context)

                case '%=':
                    return operatorEvaluator.evaluateModuloAssignment(operands, context)

                case '<<=':
                    return operatorEvaluator.evaluateLeftShiftAssignment(operands, context)

                case '>>=':
                    return operatorEvaluator.evaluateRightShiftAssignment(operands, context)

                case '>>>=':
                    return operatorEvaluator.evaluateUnsignedRightShiftAssignment(operands, context)

                case '&=':
                    return operatorEvaluator.evaluateBitwiseAndAssignment(operands, context)

                case '^=':
                    return operatorEvaluator.evaluateBitwiseXorAssignment(operands, context)

                case '|=':
                    return operatorEvaluator.evaluateBitwiseOrAssignment(operands, context)

                // Handle await statement
                case 'await':
                    return operatorEvaluator.evaluateAwait(operands, context)

                // Handle line comment
                case '//':
                    return operatorEvaluator.evaluateLineComment(operands, context)

                // Handle block comment
                case '/*':
                    return operatorEvaluator.evaluateBlockComment(operands, context)
                // Handle return statement
                case 'return':
                    return operatorEvaluator.evaluateReturn(operands, context)

                // Handle yield statement
                case 'yield':
                    return operatorEvaluator.evaluateYield(operands, context)

                // Handle yield* statement
                case 'yield*':
                    return operatorEvaluator.evaluateYieldStar(operands, context)

                // Handle if statements
                case 'if':
                    return operatorEvaluator.evaluateIf(operands, context)

                // Handle while loops
                case 'while':
                    return operatorEvaluator.evaluateWhile(operands, context)

                // Handle for loops
                case 'for':
                    return operatorEvaluator.evaluateFor(operands, context)

                case '++':
                    return operatorEvaluator.evaluateIncrement(operands, context)

                case '--':
                    return operatorEvaluator.evaluateDecrement(operands, context)
            }
        }

        // Check for arrow function syntax (e.g., "(a, b) =>")
        const arrowFunctionKey = keys.find(key => key.includes('=>'))
        if (arrowFunctionKey) {
            // Extract parameter names from the key
            const paramMatch = arrowFunctionKey.match(/\(([^)]*)\)/)
            const params = paramMatch ? paramMatch[1].split(',').map(p => p.trim()).filter(p => p) : []
            const body = (jeon as any)[arrowFunctionKey]
            // DEBUG: Log the body structure
            // console.log('Arrow function body:', body);

            // Create and return a JavaScript function
            return function (...args: any[]) {
                // Create a new context with the parameters
                const functionContext = { ...context }
                assignParamsToContext(params, args, functionContext)

                // Evaluate the function body with the new context
                // The body is an array of statements
                if (Array.isArray(body)) {
                    // Process all statements in the body, handling function declarations first
                    // Similar to the array processing logic but with the functionContext
                    for (let i = 0; i < body.length; i++) {
                        const item = body[i]

                        // Handle function declarations in the arrow function body
                        if (item && typeof item === 'object' && !Array.isArray(item)) {
                            const itemKeys = Object.keys(item)

                            // Handle regular function declarations
                            const functionDeclarationKey = itemKeys.find(key => key.startsWith('function') && !key.startsWith('function*'))
                            if (functionDeclarationKey) {
                                // Extract function name and parameters
                                let paramStr = ''
                                let funcName = ''
                                const nameMatch = functionDeclarationKey.match(/function\s+(\w+)\s*\(([^)]*)\)/)
                                if (nameMatch) {
                                    funcName = nameMatch[1]
                                    paramStr = nameMatch[2]
                                }
                                const funcParams = paramStr ? paramStr.split(',').map((p: string) => p.trim()).filter((p: string) => p) : []
                                const funcBody = (item as any)[functionDeclarationKey]

                                // Create the function
                                const functionResult = function (...funcArgs: any[]) {
                                    // Create a new context with the parameters
                                    const innerFunctionContext: any = {}
                                    // Copy all properties from the current function context
                                    for (const key in functionContext) {
                                        innerFunctionContext[key] = functionContext[key]
                                    }
                                    // Add the parameters (handling rest params)
                                    assignParamsToContext(funcParams, funcArgs, innerFunctionContext)

                                    // Evaluate the function body
                                    if (Array.isArray(funcBody)) {
                                        let result: any
                                        for (const stmt of funcBody) {
                                            result = evalJeon(stmt, innerFunctionContext)

                                            // Handle return statements
                                            if (stmt && typeof stmt === 'object' && !Array.isArray(stmt) && stmt['return'] !== undefined) {
                                                return evalJeon(stmt['return'], innerFunctionContext)
                                            }
                                        }
                                        return result
                                    } else {
                                        return evalJeon(funcBody, innerFunctionContext)
                                    }
                                }

                                // Add the function to the function context so it's available for subsequent statements
                                functionContext[funcName] = functionResult

                                // If this is the last item, return its result
                                if (i === body.length - 1) {
                                    return functionResult
                                }
                                continue // Skip normal evaluation for function declarations
                            }

                            // Handle generator function declarations
                            const generatorFunctionDeclarationKey = itemKeys.find(key => key.startsWith('function*'))
                            if (generatorFunctionDeclarationKey) {
                                // Extract function name and parameters
                                let paramStr = ''
                                let funcName = ''
                                const nameMatch = generatorFunctionDeclarationKey.match(/function\*\s+(\w+)\s*\(([^)]*)\)/)
                                if (nameMatch) {
                                    funcName = nameMatch[1]
                                    paramStr = nameMatch[2]
                                }
                                const funcParams = paramStr ? paramStr.split(',').map((p: string) => p.trim()).filter((p: string) => p) : []
                                const funcBody = (item as any)[generatorFunctionDeclarationKey]

                                // Create the generator function
                                const functionResult = function* (...funcArgs: any[]) {
                                    // Create a new context with the parameters
                                    const innerFunctionContext: any = {}
                                    // Copy all properties from the current function context
                                    for (const key in functionContext) {
                                        innerFunctionContext[key] = functionContext[key]
                                    }
                                    // Add the parameters (handling rest params)
                                    assignParamsToContext(funcParams, funcArgs, innerFunctionContext)

                                    // Evaluate the function body
                                    if (Array.isArray(funcBody)) {
                                        // Process generator statements
                                        for (const stmt of funcBody) {
                                            // Handle yield statements
                                            if (stmt && typeof stmt === 'object' && !Array.isArray(stmt) && 'yield' in stmt) {
                                                const yieldValue = evalJeon(stmt['yield'], innerFunctionContext)
                                                yield yieldValue
                                            }
                                            // Handle return statements
                                            else if (stmt && typeof stmt === 'object' && !Array.isArray(stmt) && stmt['return'] !== undefined) {
                                                const returnValue = evalJeon(stmt['return'], innerFunctionContext)
                                                return returnValue
                                            }
                                            // Handle other statements
                                            else {
                                                evalJeon(stmt, innerFunctionContext)
                                            }
                                        }
                                    } else {
                                        evalJeon(funcBody, innerFunctionContext)
                                    }
                                }

                                // Add the function to the function context so it's available for subsequent statements
                                functionContext[funcName] = functionResult

                                // If this is the last item, return its result
                                if (i === body.length - 1) {
                                    return functionResult
                                }
                                continue // Skip normal evaluation for function declarations
                            }
                        }

                        // Normal evaluation for non-declaration items
                        const result = evalJeon(item, functionContext)

                        // Handle return statements
                        if (item && typeof item === 'object' && !Array.isArray(item) && item['return'] !== undefined) {
                            return result
                        }

                        // If this is the last item, return its result
                        if (i === body.length - 1) {
                            return result
                        }
                    }

                    // Fallback return
                    return undefined
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
            let funcName = ''
            let paramStr = ''
            const nameMatch = functionDeclarationKey.match(/function\s+(\w+)\s*\(([^)]*)\)/)
            if (nameMatch) {
                funcName = nameMatch[1]
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

            // Create the function
            const functionResult = function (...args: any[]) {
                // Create a new context with the parameters (handling rest params)
                const functionContext = { ...context }
                assignParamsToContext(params, args, functionContext)

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

            // For named functions, add to context and return undefined
            // For anonymous functions, check context to determine behavior
            if (funcName) {
                // Add the function to the context so it's available for subsequent statements
                context[funcName] = functionResult

                // Named function declarations evaluate to undefined in JavaScript
                return undefined
            } else {
                // For anonymous functions, check if this is likely a function declaration
                // Heuristic: If this function is wrapped in parentheses at the top level
                // in a specific pattern, treat it as a declaration and return undefined
                // Pattern: { "(": { "function(...)": [...] } }

                // This is a simplified heuristic - in practice, we'd need context
                // For now, we'll assume anonymous functions return function objects
                // and handle special cases separately if needed
                return functionResult
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

                // Add the function to the context so it's available for subsequent statements
                context[funcName] = async function (...args: any[]) {
                    // Create a new context with the parameters (handling rest params)
                    const functionContext = { ...context }
                    assignParamsToContext(params, args, functionContext)

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

                // Async function declarations evaluate to undefined in JavaScript
                return undefined
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

                // Add the function to the context so it's available for subsequent statements
                context[funcName] = function* (...args: any[]) {
                    // Create a new context with the parameters (handling rest params)
                    const functionContext = { ...context }
                    assignParamsToContext(params, args, functionContext)

                    // Evaluate the function body with the new context
                    // The body is an array of statements
                    if (Array.isArray(body)) {
                        // Create a generator that can handle nested control structures
                        yield* createGeneratorFromStatements(body, functionContext)
                        return undefined
                    }
                }

                // Generator function declarations evaluate to undefined in JavaScript
                return undefined
            }
        }


        // Handle variable declarations (@ for let/var, @@ for const)
        if (keys.length === 1 && (keys[0] === '@' || keys[0] === '@@')) {
            const declarations = (jeon as JeonObject)[keys[0]]
            if (typeof declarations === 'object' && declarations !== null) {
                // Check if this is a destructuring assignment by looking for the '=' key
                if ('=' in declarations) {
                    // This is a destructuring assignment
                    const assignment = declarations['=']
                    if (Array.isArray(assignment) && assignment.length === 2) {
                        const [pattern, sourceExpr] = assignment
                        const sourceValue = sourceExpr ? evalJeon(sourceExpr, context) : {}

                        // Handle array destructuring pattern
                        if (Array.isArray(pattern)) {
                            // Collect destructured variable names for rest operator handling
                            const destructuredVars = new Set<string>()

                            for (let i = 0; i < pattern.length; i++) {
                                const varName = pattern[i]
                                if (varName === null) {
                                    // Skip empty slots
                                    continue
                                }

                                if (typeof varName === 'string' && varName.startsWith('...')) {
                                    // Rest element like '...rest'
                                    const restVarName = varName.substring(3)
                                    if (Array.isArray(sourceValue)) {
                                        // Array destructuring - get rest of the array from index i
                                        const value = sourceValue.slice(i)
                                        context[restVarName] = value
                                    } else {
                                        // Object destructuring - collect remaining properties
                                        const restObj: Record<string, any> = {}
                                        if (sourceValue && typeof sourceValue === 'object') {
                                            for (const key in sourceValue) {
                                                if (!destructuredVars.has(key)) {
                                                    restObj[key] = sourceValue[key]
                                                }
                                            }
                                        }
                                        context[restVarName] = restObj
                                    }
                                } else if (typeof varName === 'string') {
                                    // Check if this is a nested destructuring pattern
                                    if (varName.startsWith('[@') && varName.endsWith(']')) {
                                        // Nested array destructuring pattern like [@nestedA, @nestedB]
                                        // Extract the nested variable names
                                        const inner = varName.substring(1, varName.length - 1)
                                        const nestedVars = inner.split(',').map(v => v.trim().substring(1)) // Remove @ prefix

                                        // For nested destructuring in object destructuring, we need to get the right property
                                        // In this case, we're looking for the 'z' property which contains the nested object
                                        if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
                                            // Find the property that corresponds to this position
                                            // Since this is position 2 in the pattern [x, y, [nestedA, nestedB]],
                                            // we need to find the third property in the source object
                                            const sourceKeys = Object.keys(sourceValue)
                                            if (i < sourceKeys.length) {
                                                const sourcePropName = sourceKeys[i]
                                                const nestedSource = sourceValue[sourcePropName]

                                                // Handle the nested destructuring
                                                if (nestedSource && typeof nestedSource === 'object' && !Array.isArray(nestedSource)) {
                                                    // Object destructuring for nested variables
                                                    for (let j = 0; j < nestedVars.length; j++) {
                                                        const nestedVar = nestedVars[j]
                                                        if (nestedVar && nestedVar in nestedSource) {
                                                            context[nestedVar] = nestedSource[nestedVar]
                                                        } else {
                                                            context[nestedVar] = undefined
                                                        }
                                                    }
                                                } else if (Array.isArray(nestedSource)) {
                                                    // Array destructuring for nested variables
                                                    for (let j = 0; j < nestedVars.length; j++) {
                                                        const nestedVar = nestedVars[j]
                                                        if (nestedVar) {
                                                            context[nestedVar] = j < nestedSource.length ? nestedSource[j] : undefined
                                                        }
                                                    }
                                                } else {
                                                    // If nested source is not an object or array, set all nested vars to undefined
                                                    for (const nestedVar of nestedVars) {
                                                        if (nestedVar) {
                                                            context[nestedVar] = undefined
                                                        }
                                                    }
                                                }
                                            } else {
                                                // If no source property at this position, set all nested vars to undefined
                                                for (const nestedVar of nestedVars) {
                                                    if (nestedVar) {
                                                        context[nestedVar] = undefined
                                                    }
                                                }
                                            }
                                        } else {
                                            // If source is not an object, set all nested vars to undefined
                                            for (const nestedVar of nestedVars) {
                                                if (nestedVar) {
                                                    context[nestedVar] = undefined
                                                }
                                            }
                                        }
                                    } else if (varName.startsWith('[nested_')) {
                                        // Placeholder for nested patterns - treat as regular variable for now
                                        destructuredVars.add(varName)
                                        if (Array.isArray(sourceValue)) {
                                            // Array destructuring - get value by index
                                            const value = i < sourceValue.length ? sourceValue[i] : undefined
                                            context[varName] = value
                                        } else {
                                            // Object destructuring - get value by property name
                                            const value = sourceValue && typeof sourceValue === 'object' && varName in sourceValue
                                                ? sourceValue[varName]
                                                : undefined
                                            context[varName] = value
                                        }
                                    } else {
                                        // Regular variable
                                        destructuredVars.add(varName)
                                        if (Array.isArray(sourceValue)) {
                                            // Array destructuring - get value by index
                                            const value = i < sourceValue.length ? sourceValue[i] : undefined
                                            context[varName] = value
                                        } else {
                                            // Object destructuring - get value by property name
                                            // Debug: log what we're trying to access
                                            console.log(`Destructuring: trying to access property '${varName}' from sourceValue:`, sourceValue)
                                            console.log(`sourceValue type:`, typeof sourceValue)
                                            console.log(`sourceValue keys:`, sourceValue ? Object.keys(sourceValue) : 'null/undefined')
                                            console.log(`varName in sourceValue:`, sourceValue && typeof sourceValue === 'object' && varName in sourceValue)

                                            // More robust property access for class constructors and other objects
                                            let value
                                            if (sourceValue && (typeof sourceValue === 'object' || typeof sourceValue === 'function')) {
                                                const hasPropertyInKeys = Object.keys(sourceValue).includes(varName)

                                                // Prioritize Object.keys check since it shows the properties exist
                                                if (hasPropertyInKeys) {
                                                    // If Object.keys includes it, the property exists
                                                    value = sourceValue[varName]
                                                } else if (varName in sourceValue) {
                                                    value = sourceValue[varName]
                                                } else if (sourceValue.hasOwnProperty && sourceValue.hasOwnProperty(varName)) {
                                                    value = sourceValue[varName]
                                                } else {
                                                    // Try direct property access as a fallback
                                                    try {
                                                        value = sourceValue[varName]
                                                    } catch (e) {
                                                        value = undefined
                                                    }
                                                }
                                            } else {
                                                value = undefined
                                            }
                                            context[varName] = value
                                            console.log(`Assigned ${varName} =`, value)
                                        }
                                    }
                                }
                            }
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
