import { visitorRegistry } from './jeon2js.visitors/visitorRegistry'
import { JeonExpression, JeonObject } from './JeonExpression'

/**
 * Converts JEON (JSON-based Executable Object Notation) to JavaScript code
 * @param jeon The JEON object to convert
 * @param options Conversion options
 * @param options.json The JSON implementation to use (JSON or JSON5)
 * @param options.closure Whether to enable closure mode for safe evaluation (default: false)
 * @param isTopLevel Whether this is a top-level call (default: true)
 */
export function jeon2js(jeon: JeonExpression, options?: { json?: typeof JSON, closure?: boolean }, isTopLevel: boolean = true): string {
    // Set default JSON implementation if not provided
    const jsonImpl = options?.json || JSON
    const closure = options?.closure || false

    // Create a visit function that preserves the closure option
    const visit = (item: any) => jeon2js(item, { json: jsonImpl, closure }, false)

    if (typeof jeon === 'string') {
        return visitorRegistry.visitString(jeon, jsonImpl)
    }

    if (typeof jeon === 'number' || typeof jeon === 'boolean' || jeon === null) {
        return visitorRegistry.visitPrimitive(jeon, jsonImpl)
    }

    if (Array.isArray(jeon)) {
        return visitorRegistry.visitArray(jeon, visit, jsonImpl, isTopLevel, closure)
    }

    if (typeof jeon === 'object' && jeon !== null) {
        const keys = Object.keys(jeon)
        if (keys.length === 0) {
            return '{}'
        }

        // Handle function declarations at the top level
        const functionDeclarationResult = visitorRegistry.visitFunctionDeclaration(keys, jeon, visit, jsonImpl, closure)
        if (functionDeclarationResult) {
            // When we process nested elements, they're not top level
            return functionDeclarationResult
        }

        // Handle special JEON constructs
        if (keys.length === 1) {
            const op = keys[0]
            const operands = (jeon as JeonObject)[op]

            // Handle operators
            const operatorResult = visitorRegistry.visitOperator(op, operands, visit, jsonImpl, closure)
            if (operatorResult) {
                return operatorResult
            }

            // Handle try/catch
            if (op === 'try') {
                return visitorRegistry.visitTryCatch(operands, visit, jsonImpl, closure)
            }

            // Handle variable declarations
            if (op === '@' || op === '@@') {
                return visitorRegistry.visitVariableDeclaration(op, operands, visit, jsonImpl, closure)
            }

            // Handle arrow functions
            const arrowFunctionResult = visitorRegistry.visitArrowFunction(op, operands, visit, jsonImpl, closure)
            if (arrowFunctionResult) {
                // When we process nested elements, they're not top level
                return arrowFunctionResult
            }

            // Handle class declarations
            const classResult = visitorRegistry.visitClass(op, operands, keys, visit, jsonImpl, closure)
            if (classResult) {
                // When we process nested elements, they're not top level
                return classResult
            }

            // Handle sequencing blocks
            const sequencingResult = visitorRegistry.visitSequencing(op, operands, visit, jsonImpl, closure)
            if (sequencingResult) {
                return sequencingResult
            }

            // Handle property access
            const propertyAccessResult = visitorRegistry.visitPropertyAccess(op, operands, visit, jsonImpl, closure)
            if (propertyAccessResult) {
                return propertyAccessResult
            }

            // Handle switch statements
            if (op === 'switch') {
                return visitorRegistry.visitSwitch(operands, visit, jsonImpl, closure)
            }
        }

        // Handle JSX
        const jsxResult = visitorRegistry.visitJSX(keys, jeon, visit, jsonImpl, closure)
        if (jsxResult) {
            return jsxResult
        }

        // Handle function calls
        const functionCallResult = visitorRegistry.visitFunctionCall(keys, jeon, visit, jsonImpl, closure)
        if (functionCallResult) {
            return functionCallResult
        }

        // Default object handling
        return visitorRegistry.visitObject(keys, jeon, visit, jsonImpl, closure)
    }

    return jsonImpl.stringify(jeon)
}