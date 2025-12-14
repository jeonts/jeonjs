import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

// This visitor is no longer used since variable declarations are handled in the Program visitor
// to group consecutive declarations of the same kind.
export function visitVariableDeclaration(node: acorn.VariableDeclaration, options?: { json?: typeof JSON }): any {
    // Use different keys based on declaration kind
    // Treat var the same as let for simplicity
    const key = (node as acorn.VariableDeclaration).kind === 'const' ? '@@' : '@'
    const declarations: Record<string, any> = {}
    for (const decl of node.declarations) {
        if (decl.id.type === 'Identifier') {
            if (decl.init) {
                // Check if this is an explicit undefined assignment
                const initValue = ast2jeon(decl.init, options)
                if (initValue === '@undefined') {
                    // Explicit undefined assignment - use @@undefined to distinguish
                    declarations[(decl.id as acorn.Identifier).name] = '@@undefined'
                } else {
                    declarations[(decl.id as acorn.Identifier).name] = initValue
                }
            } else {
                // Uninitialized variable - use @undefined
                declarations[(decl.id as acorn.Identifier).name] = '@undefined'
            }
        } else if (decl.id.type === 'ObjectPattern') {
            // Handle object destructuring patterns like const {a, b} = obj
            const initExpr = decl.init ? ast2jeon(decl.init, options) : null
            // Create the destructuring pattern array
            const pattern: any[] = []
            for (const prop of (decl.id as acorn.ObjectPattern).properties) {
                if (prop.type === 'Property' && prop.key.type === 'Identifier') {
                    const propName = (prop.key as acorn.Identifier).name
                    pattern.push(propName)
                } else if (prop.type === 'RestElement') {
                    // Handle rest element in object destructuring
                    const arg = (prop as any).argument
                    if (arg && arg.type === 'Identifier') {
                        const varName = arg.name
                        pattern.push(`...${varName}`)
                    }
                }
            }
            // Store as assignment with pattern and source
            declarations['='] = [pattern, initExpr]
        } else if (decl.id.type === 'ArrayPattern') {
            // Handle array destructuring patterns like const [a, b] = arr
            const initExpr = decl.init ? ast2jeon(decl.init, options) : null
            // Create the destructuring pattern array
            const pattern: any[] = []
            const arrayPattern = decl.id as acorn.ArrayPattern
            for (let i = 0; i < arrayPattern.elements.length; i++) {
                const element = arrayPattern.elements[i]
                if (element) {
                    if (element.type === 'Identifier') {
                        // Simple identifier like 'a' in [a, b]
                        const varName = (element as acorn.Identifier).name
                        pattern.push(varName)
                    } else if (element.type === 'RestElement') {
                        // Rest element like '...rest' in [a, b, ...rest]
                        const arg = (element as any).argument
                        if (arg && arg.type === 'Identifier') {
                            const varName = arg.name
                            pattern.push(`...${varName}`)
                        }
                    } else if (element.type === 'ArrayPattern') {
                        // Nested array patterns like [a, [b, c]]
                        // Convert the nested pattern to a string representation
                        const nestedPattern = convertNestedArrayPattern(element as acorn.ArrayPattern)
                        pattern.push(nestedPattern)
                    } else if (element.type === 'ObjectPattern') {
                        // Nested object patterns like [a, {b, c}]
                        // For now, we'll add a placeholder - in a full implementation we'd need to handle this properly
                        pattern.push(`[nested_object_${i}]`)
                    }
                } else {
                    // Empty slot like [,] in [a,,b]
                    pattern.push(null)
                }
            }
            // Store as assignment with pattern and source
            declarations['='] = [pattern, initExpr]
        }
    }
    return {
        [key]: declarations
    }
}

/**
 * Converts a nested ArrayPattern to its string representation
 * @param pattern The nested ArrayPattern node
 */
function convertNestedArrayPattern(pattern: acorn.ArrayPattern): string {
    const elements: string[] = []
    for (const element of pattern.elements) {
        if (!element) {
            // Empty slot
            elements.push('')
        } else if (element.type === 'Identifier') {
            // Simple identifier
            elements.push(`@${(element as acorn.Identifier).name}`)
        } else if (element.type === 'RestElement') {
            // Rest element
            const arg = (element as any).argument
            if (arg && arg.type === 'Identifier') {
                elements.push(`...@${arg.name}`)
            }
        } else if (element.type === 'ArrayPattern') {
            // Further nested array pattern
            elements.push(convertNestedArrayPattern(element as acorn.ArrayPattern))
        } else if (element.type === 'ObjectPattern') {
            // Nested object pattern
            elements.push(`[nested_object]`)
        }
    }
    return `[${elements.join(', ')}]`
}