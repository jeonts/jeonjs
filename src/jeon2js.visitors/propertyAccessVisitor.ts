/**
 * Handles property access conversion in JEON to JavaScript
 * @param op The operator (. or () or new or =)
 * @param operands The operands for the property access
 * @param visit The visitor function to process nested elements
 * @param jsonImpl The JSON implementation to use (JSON or JSON5)
 */
export function visitPropertyAccess(op: string, operands: any, visit: (item: any) => string, jsonImpl?: typeof JSON): string {
    // Handle object property access
    if (op === '.') {
        if (Array.isArray(operands) && operands.length >= 2) {
            return `${visit(operands[0])}.${operands.slice(1).join('.')}`
        }
    }

    // Handle function execution
    if (op === '()') {
        if (Array.isArray(operands) && operands.length >= 1) {
            const func = visit(operands[0])
            const args = operands.slice(1).map(arg => visit(arg))
            return `${func}(${args.join(', ')})`
        }
    }

    // Handle new operator
    if (op === 'new') {
        if (Array.isArray(operands) && operands.length >= 1) {
            const constructor = operands[0]
            const args = operands.slice(1).map(arg => visit(arg))
            return `new ${constructor}(${args.join(', ')})`
        }
    }

    // Handle assignment
    if (op === '=') {
        if (Array.isArray(operands) && operands.length === 2) {
            return `${visit(operands[0])} = ${visit(operands[1])}`
        }
    }

    return ''
}