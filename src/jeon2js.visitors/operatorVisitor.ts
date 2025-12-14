/**
 * Handles operator conversion in JEON to JavaScript
 * @param op The operator
 * @param operands The operands for the operator
 * @param visit The visitor function to process nested elements
 * @param jsonImpl The JSON implementation to use (JSON or JSON5)
 */
import { visitArray } from './arrayVisitor'
export function visitOperator(op: string, operands: any, visit: (item: any) => string, jsonImpl?: typeof JSON): string {
    // Handle unary operators
    switch (op) {
        case '-':
        case '+':
        case '!':
        case '~':
        case 'typeof':
        case 'void':
        case 'delete':
            // Unary operators with prefix notation
            // Check if it's a unary operator (single operand) vs binary operator (multiple operands)
            if (Array.isArray(operands)) {
                // Binary operator case - handled below
                break
            } else if (typeof operands !== 'undefined') {
                // Unary operator case
                // Special handling for delete operator to ensure proper spacing
                if (op === 'delete') {
                    return `${op} ${visit(operands)}`
                }
                return `${op}${visit(operands)}`
            }
            break

        case '++':
        case '--':
            // Handle increment/decrement operators
            if (typeof operands !== 'undefined') {
                // For prefix operators
                return `${op}${visit(operands)}`
            }
            break

        case '++.':
        case '--.':
            // Handle postfix increment/decrement operators
            const actualOp = op.substring(0, 2)
            if (typeof operands !== 'undefined') {
                return `${visit(operands)}${actualOp}`
            }
            break

        case '()':
            // Handle function call operator
            if (Array.isArray(operands) && operands.length >= 1) {
                const funcExpr = visit(operands[0])
                const args = operands.slice(1).map(arg => visit(arg))

                // Special handling for arrow functions and function expressions
                // that need to be wrapped in parentheses for immediate invocation
                let formattedFuncExpr = funcExpr
                if (funcExpr.includes('=>') || funcExpr.includes('function')) {
                    // Check if the function expression is already wrapped in parentheses
                    if (!funcExpr.startsWith('(') || !funcExpr.endsWith(')')) {
                        formattedFuncExpr = `(${funcExpr})`
                    }
                }

                return `${formattedFuncExpr}(${args.join(', ')})`
            }
            break
    }

    switch (op) {
        case '(':
            // Handle parentheses expressions'{}
            return `(${visit(operands)})`

        case '//':
            // Handle comment operator - return JavaScript comment
            if (typeof operands === 'string') {
                return `\n//${operands}\n`
            }
            return '\n//(comment)\n'

        case '/*':
            // Handle multiline block comment operator - return JavaScript block comment
            if (Array.isArray(operands)) {
                // For array of strings, join with newlines to create multiline comment
                const commentText = operands.join('\n')
                return `\n/*${commentText}*/\n`
            } else if (typeof operands === 'string') {
                // For single string, create single-line block comment
                return `\n/*${operands}*/\n`
            }
            // Fallback for invalid operands
            return '\n/* (comment) */\n'

        case '/ /':
            // Handle regex operator
            if (typeof operands === 'object' && operands !== null) {
                const pattern = operands.pattern || ''
                const flags = operands.flags || ''
                return `/${pattern}/${flags}`
            }
            return '/(?:)/'

        case '+':
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

        case '-':
            // Handle binary minus (separate from unary minus)
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


            return `function(${params.join(', ')}) {\n  ${body}\n}`

        case 'await':
            return `await ${visit(operands)}`

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

        case ',':
            // Handle sequence expressions (comma operator)
            if (Array.isArray(operands)) {
                return operands.map(operand => visit(operand)).join(', ')
            }
            break

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