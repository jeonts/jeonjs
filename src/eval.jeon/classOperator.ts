import { evalJeon } from '../safeEval'

// Handle class operator for class expressions
export function evaluateClass(operands: any, context: Record<string, any>): any {
    if (typeof operands === 'object' && operands !== null) {
        // Create a class constructor that uses evalJeon internally
        const ClassConstructor = function (this: any, ...args: any[]) {
            // Find constructor in class definition
            const constructorKey = Object.keys(operands).find(key => key.startsWith('constructor'))
            if (constructorKey) {
                const constructorBody = operands[constructorKey]

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
        const methodKeys = Object.keys(operands).filter(key => key.includes('(') && !key.startsWith('constructor'))
        methodKeys.forEach(methodKey => {
            // Check if this is a static method
            const isStatic = methodKey.startsWith('static ')
            const actualMethodKey = isStatic ? methodKey.substring(7) : methodKey // Remove 'static ' prefix

            const methodName = actualMethodKey.split('(')[0]
            const methodBody = operands[methodKey]

            // Extract method parameters
            const methodParamMatch = actualMethodKey.match(/\(([^)]*)\)/)
            let methodParams: string[] = []
            if (methodParamMatch && methodParamMatch[1]) {
                methodParams = methodParamMatch[1].split(',').map((p: string) => p.trim()).filter((p: string) => p)
            }

            if (isStatic) {
                // Create static method function
                (ClassConstructor as any)[methodName] = function (...args: any[]) {
                    // Create context with parameters (no 'this' for static methods)
                    const methodContext: any = {}
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
            } else {
                // Create instance method function
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
            }
        })

        return ClassConstructor
    }

    // Fallback - return operands as is
    return operands
}