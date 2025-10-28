import * as ts from 'typescript'
import { visitorRegistry } from './jeon2js.visitors/visitorRegistry'

/**
 * Converts JEON (JSON-based Executable Object Notation) to JavaScript code
 * @param jeon The JEON object to convert
 * @param options Conversion options
 * @param options.json The JSON implementation to use (JSON or JSON5)
 * @param isTopLevel Whether this is a top-level call (default: true)
 */
export function jeon2js(jeon: any, options?: { json?: typeof JSON }, isTopLevel: boolean = true): string {
    // Set default JSON implementation if not provided
    const jsonImpl = options?.json || JSON

    if (typeof jeon === 'string') {
        return visitorRegistry.visitString(jeon, jsonImpl)
    }

    if (typeof jeon === 'number' || typeof jeon === 'boolean' || jeon === null) {
        return visitorRegistry.visitPrimitive(jeon, jsonImpl)
    }

    if (Array.isArray(jeon)) {
        return visitorRegistry.visitArray(jeon, jeon2js, jsonImpl, isTopLevel)
    }

    if (typeof jeon === 'object' && jeon !== null) {
        const keys = Object.keys(jeon)
        if (keys.length === 0) {
            return '{}'
        }

        // Handle function declarations at the top level
        const functionDeclarationResult = visitorRegistry.visitFunctionDeclaration(keys, jeon, jeon2js, jsonImpl)
        if (functionDeclarationResult) {
            // When we process nested elements, they're not top level
            return functionDeclarationResult
        }

        // Handle special JEON constructs
        if (keys.length === 1) {
            const op = keys[0]
            const operands = jeon[op]

            // Handle operators
            const operatorResult = visitorRegistry.visitOperator(op, operands, jeon2js, jsonImpl)
            if (operatorResult) {
                return operatorResult
            }

            // Handle try/catch
            if (op === 'try') {
                return visitorRegistry.visitTryCatch(operands, jeon2js, jsonImpl)
            }

            // Handle variable declarations
            if (op === '@' || op === '@@') {
                return visitorRegistry.visitVariableDeclaration(op, operands, jeon2js, jsonImpl)
            }

            // Handle arrow functions
            const arrowFunctionResult = visitorRegistry.visitArrowFunction(op, operands, jeon2js, jsonImpl)
            if (arrowFunctionResult) {
                // When we process nested elements, they're not top level
                return arrowFunctionResult
            }

            // Handle class declarations
            const classResult = visitorRegistry.visitClass(op, operands, keys, jeon2js, jsonImpl)
            if (classResult) {
                // When we process nested elements, they're not top level
                return classResult
            }

            // Handle sequencing blocks
            const sequencingResult = visitorRegistry.visitSequencing(op, operands, jeon2js, jsonImpl)
            if (sequencingResult) {
                return sequencingResult
            }

            // Handle property access
            const propertyAccessResult = visitorRegistry.visitPropertyAccess(op, operands, jeon2js, jsonImpl)
            if (propertyAccessResult) {
                return propertyAccessResult
            }

            // Handle switch statements
            if (op === 'switch') {
                return visitorRegistry.visitSwitch(operands, jeon2js, jsonImpl)
            }
        }

        // Handle JSX
        const jsxResult = visitorRegistry.visitJSX(keys, jeon, jeon2js, jsonImpl)
        if (jsxResult) {
            return jsxResult
        }

        // Handle function calls
        const functionCallResult = visitorRegistry.visitFunctionCall(keys, jeon, jeon2js, jsonImpl)
        if (functionCallResult) {
            return functionCallResult
        }

        // Default object handling
        return visitorRegistry.visitObject(keys, jeon, jeon2js, jsonImpl)
    }

    return jsonImpl.stringify(jeon)
}