/**
 * Handles switch statement conversion in JEON to JavaScript
 * @param operands The operands for the switch statement
 * @param visit The visitor function to process nested elements
 * @param jsonImpl The JSON implementation to use (JSON or JSON5)
 * @param closure Whether to enable closure mode for safe evaluation (default: false)
 */
export function visitSwitch(operands: any, visit: (item: any) => string, jsonImpl?: typeof JSON, closure: boolean = false): string {
    if (!Array.isArray(operands) || operands.length !== 2) {
        return ''
    }

    const discriminant = visit(operands[0])
    const cases = operands[1]

    if (!Array.isArray(cases)) {
        return ''
    }

    const caseStatements = cases.map(caseClause => {
        if (caseClause.case !== undefined) {
            const caseValue = visit(caseClause.case)
            const body = Array.isArray(caseClause.body)
                ? caseClause.body.map((stmt: any) => visit(stmt)).join(';\n    ')
                : visit(caseClause.body)
            return `    case ${caseValue}:\n      ${body};`
        } else if (caseClause.default !== undefined) {
            const body = Array.isArray(caseClause.default)
                ? caseClause.default.map((stmt: any) => visit(stmt)).join(';\n    ')
                : visit(caseClause.default)
            return `    default:\n      ${body};`
        }
        return ''
    }).filter(stmt => stmt !== '')

    return `switch (${discriminant}) {\n${caseStatements.join('\n')}\n  }`
}