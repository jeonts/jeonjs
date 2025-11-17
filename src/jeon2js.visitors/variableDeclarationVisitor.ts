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
    const declarationType = op === '@@' ? 'const' : 'let'

    // Categorize variables
    const uninitializedVars: string[] = []
    const initializedVars: { name: string, value: any }[] = []
    const specialDeclarations: string[] = []

    for (const [name, value] of Object.entries(operands)) {
        // Check if this is a class declaration
        if (typeof value === 'object' && value !== null && (value as any)['class']) {
            // This is a class assigned to a variable
            const classDef = (value as any)['class']
            const classResult = visit({
                'class': classDef
            })
            // Replace AnonymousClass with empty for anonymous class expression
            specialDeclarations.push(`${declarationType} ${name} = ${classResult.replace('class AnonymousClass', 'class')}`)
        }
        // Check if this is a function declaration
        else if (typeof value === 'object' && value !== null) {
            const valueKeys = Object.keys(value)
            if (valueKeys.length === 1) {
                const valueOp = valueKeys[0]
                if (valueOp.startsWith('function') || valueOp.startsWith('async function') || valueOp.endsWith('=>')) {
                    specialDeclarations.push(`const ${name} = ${visit(value)}`)
                    continue
                }
                // Check if this is a JSX element
                if (valueOp.startsWith('<') && valueOp.endsWith('>')) {
                    specialDeclarations.push(`${declarationType} ${name} = ${visit(value)};`)
                    continue
                }
            }
            // Handle initialized variables with object values
            initializedVars.push({ name, value })
        }
        // Handle uninitialized variables
        else if (value === undefined || value === '@undefined' || value === null) {
            uninitializedVars.push(name)
        } else {
            // Handle initialized variables
            initializedVars.push({ name, value })
        }
    }

    // Group the results
    const results: string[] = []

    // Add grouped uninitialized variables
    if (uninitializedVars.length > 0) {
        results.push(`${declarationType} ${uninitializedVars.join(', ')}`)
    }

    // Add initialized variables individually
    for (const { name, value } of initializedVars) {
        results.push(`${declarationType} ${name} = ${visit(value)}`)
    }

    // Add special declarations
    results.push(...specialDeclarations)

    return results.join(';\n')
}