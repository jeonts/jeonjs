/**
 * Handles operator conversion in JEON to JavaScript
 * @param op The operator
 * @param operands The operands for the operator
 * @param visit The visitor function to process nested elements
 * @param jsonImpl The JSON implementation to use (JSON or JSON5)
 */
export function visitOperator(op: string, operands: any, visit: (item: any) => string, jsonImpl?: typeof JSON): string {
    switch (op) {
        case '+':
        case '-':
        case '*':
        case '/':
        case '%':
        case '==':
        case '===':
        case '!=':
        case '!==':
        case '<':
        case '>':
        case '<=':
        case '>=':
        case '&&':
        case '||':
            if (Array.isArray(operands) && operands.length >= 2) {
                // Handle multiple operands by chaining binary operations
                const operandStrings = operands.map(operand => visit(operand))
                return `(${operandStrings.join(` ${op} `)})`
            }
            break

        case '?':
            if (Array.isArray(operands) && operands.length === 3) {
                return `(${visit(operands[0])} ? ${visit(operands[1])} : ${visit(operands[2])})`
            }
            break

        case 'if':
            if (Array.isArray(operands) && operands.length === 2) {
                return `if (${visit(operands[0])}) { ${visit(operands[1])}; }`
            }
            break

        case 'while':
            if (Array.isArray(operands) && operands.length === 2) {
                return `while (${visit(operands[0])}) { ${visit(operands[1])}; }`
            }
            break

        case 'for':
            if (Array.isArray(operands) && operands.length === 4) {
                return `for (${visit(operands[0])}; ${visit(operands[1])}; ${visit(operands[2])}) { ${visit(operands[3])}; }`
            }
            break

        case 'function()':
            // Handle traditional function declarations
            const paramMatch = op.match(/\(([^)]*)\)/)
            const params = paramMatch ? paramMatch[1].split(',').map(p => p.trim()).filter(p => p) : []
            const body = Array.isArray(operands) ? operands.map(stmt => visit(stmt)).join(';\n  ') : visit(operands)
            return `function(${params.join(', ')}) {\n  ${body}\n}`

        case 'await':
            return `await ${visit(operands)}`

        case '++':
        case '--':
            if (Array.isArray(operands) && operands.length === 1) {
                return `${op}${visit(operands[0])}`
            }
            // Handle postfix
            return `${visit(operands)}${op}`

        case '+=':
        case '-=':
        case '*=':
        case '/=':
        case '%=':
        case '<<=':
        case '>>=':
        case '>>>=':
        case '&=':
        case '^=':
        case '|=':
            if (Array.isArray(operands) && operands.length === 2) {
                return `${visit(operands[0])} ${op} ${visit(operands[1])}`
            }
            break

        case '...':
            return `...${visit(operands)}`

        case 'yield':
            if (operands === null) {
                return `yield`
            }
            return `yield ${visit(operands)}`

        case 'yield*':
            if (operands === null) {
                return `yield*`
            }
            return `yield* ${visit(operands)}`

        case 'break':
            if (operands === null) {
                return `break`
            }
            return `break ${operands}`

        case 'return':
            if (operands === null) {
                return `return`
            }
            return `return ${visit(operands)}`

    }
    return ''
}