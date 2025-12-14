/**
 * Handles variable declaration conversion in JEON to JavaScript
 * @param op The operator (@ or @@)
 * @param operands The operands for the variable declaration
 * @param visit The visitor function to process nested elements
 * @param jsonImpl The JSON implementation to use (JSON or JSON5)
 */
export function visitVariableDeclaration(op: string, operands: any, visit: (item: any) => string, jsonImpl?: typeof JSON): string {
    // Handle variable declarations and special cases like class declarations
    const declarationType = op === '@@' ? 'const' : 'let'

    // Check if this is a destructuring assignment
    if (operands['='] && Array.isArray(operands['='])) {
        // This is a destructuring assignment
        const [pattern, source] = operands['=']

        // Convert the pattern to JavaScript destructuring syntax
        const patternStr = convertDestructuringPattern(pattern)
        const sourceStr = visit(source)

        return `${declarationType} ${patternStr} = ${sourceStr}`
    }

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
        }
        // Handle explicit undefined with @@undefined
        else if (value === '@@undefined') {
            initializedVars.push({ name, value: '@undefined' }) // Convert to @undefined for proper generation
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

/**
 * Converts a destructuring pattern array to JavaScript syntax
 * @param pattern The destructuring pattern array
 */
function convertDestructuringPattern(pattern: any[]): string {
    const elements: string[] = []

    for (const element of pattern) {
        if (element === null) {
            // Empty slot like [,] in [a,,b]
            elements.push('')
        } else if (typeof element === 'string') {
            if (element.startsWith('...')) {
                // Rest element like ...rest
                elements.push(element)
            } else if (element.startsWith('[@') && element.endsWith(']')) {
                // Nested array pattern like [@nestedA, @nestedB]
                // Remove the outer brackets and @ prefixes
                const inner = element.substring(1, element.length - 1)
                const nestedElements = inner.split(',').map(e => {
                    const trimmed = e.trim()
                    if (trimmed.startsWith('@')) {
                        return trimmed.substring(1) // Remove @ prefix
                    } else if (trimmed.startsWith('...@')) {
                        return '...' + trimmed.substring(2) // Remove @ but keep ...
                    }
                    return trimmed
                })
                elements.push(`[${nestedElements.join(', ')}]`)
            } else if (element.startsWith('[nested_')) {
                // Nested pattern placeholder - for now treat as a regular identifier
                // In a full implementation, this would need to be handled properly
                elements.push(element.replace('[', '').replace(']', ''))
            } else {
                // Regular identifier
                elements.push(element)
            }
        }
    }

    return `[${elements.join(', ')}]`
}