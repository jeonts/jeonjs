/**
 * Handles variable declaration conversion in JEON to JavaScript
 * @param op The operator (@ or @@)
 * @param operands The operands for the variable declaration
 * @param visit The visitor function to process nested elements
 * @param jsonImpl The JSON implementation to use (JSON or JSON5)
 * @param closure Whether to enable closure mode for safe evaluation (default: false)
 */
export function visitVariableDeclaration(op: string, operands: any, visit: (item: any) => string, jsonImpl?: typeof JSON, closure: boolean = false): string {
    // Handle variable declarations and special cases like class declarations
    const declarations = Object.entries(operands).map(([name, value]) => {
        // Determine declaration type
        const declarationType = op === '@@' ? 'const' : 'let'

        // Check if this is a class declaration
        if (typeof value === 'object' && value !== null && (value as any)['class']) {
            // This is a class assigned to a variable
            const classDef = (value as any)['class']
            const classResult = visit({
                'class': classDef
            })
            // Replace AnonymousClass with empty for anonymous class expression
            return `${declarationType} ${name} = ${classResult.replace('class AnonymousClass', 'class')}`
        }
        // Check if this is a function declaration
        if (typeof value === 'object' && value !== null) {
            const valueKeys = Object.keys(value)
            if (valueKeys.length === 1) {
                const valueOp = valueKeys[0]
                if (valueOp.startsWith('function') || valueOp.startsWith('async function') || valueOp.endsWith('=>')) {
                    return `const ${name} = ${visit(value)}`
                }
                // Check if this is a JSX element
                if (valueOp.startsWith('<') && valueOp.endsWith('>')) {
                    return `${declarationType} ${name} = ${visit(value)};`
                }
            }
        }
        return `${declarationType} ${name} = ${visit(value)}`
    })
    return declarations.join(';\n')
}