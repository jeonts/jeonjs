/**
 * Handles operator conversion in JEON to JavaScript
 * @param op The operator
 * @param operands The operands for the operator
 * @param visit The visitor function to process nested elements
 * @param jsonImpl The JSON implementation to use (JSON or JSON5)
 * @param closure Whether to enable closure mode for safe evaluation (default: false)
 */
export function visitOperator(op: string, operands: any, visit: (item: any) => string, jsonImpl?: typeof JSON, closure: boolean = false): string {
    switch (op) {
        case '[':
            // Handle array literals
            if (Array.isArray(operands)) {
                const elements = operands.map(operand => visit(operand)).join(', ')
                return `[${elements}]`
            }
            return '[]'

        case '(':
            // Handle parentheses expressions
            return `(${visit(operands)})`

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
                // Don't add extra parentheses for expressions already in parentheses
                return `${operandStrings.join(` ${op} `)}`
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

            // If closure mode is enabled, wrap the function in evalJeon
            if (closure) {
                // Create a function that calls evalJeon with the body and parameters
                const contextObj = params.map(p => `${p}: ${p}`).join(', ')
                return `function(${params.join(', ')}) { return evalJeon(${JSON.stringify(operands)}, {${contextObj}}); }`
            }

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