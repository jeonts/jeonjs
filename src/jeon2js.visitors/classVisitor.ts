/**
 * Handles class conversion in JEON to JavaScript
 * @param op The operator (class ClassName)
 * @param operands The operands for the class (class members)
 * @param keys The keys of the JEON object
 * @param visit The visitor function to process nested elements
 * @param jsonImpl The JSON implementation to use (JSON or JSON5)
 */
export function visitClass(op: string, operands: any, keys: string[], visit: (item: any) => string, jsonImpl?: typeof JSON): string {
    // Handle class declarations (e.g., "class Person")
    if (op.startsWith('class ')) {
        const className = op.substring(6) // Extract class name after "class "
        const classMembers = operands

        // Extract extends clause if present
        const extendsClause = classMembers['extends'] ? ` extends ${visit(classMembers['extends'])}` : ''

        const memberEntries = Object.entries(classMembers)
            .filter(([key]) => key !== 'extends') // Skip extends property
            .map(([key, value]) => {
                // Handle constructor
                if (key.startsWith('constructor(')) {
                    const paramMatch = key.match(/\(([^)]*)\)/)
                    const params = paramMatch ? paramMatch[1].split(',').map(p => p.trim()).filter(p => p) : []
                    const body = Array.isArray(value) ? value.map((stmt: any) => visit(stmt)).join(';\n    ') : visit(value)
                    return `  ${key.split('(')[0]}(${params.join(', ')}) {\n    ${body}\n  }`
                }
                // Handle methods
                else if (key.includes('(')) {
                    const methodMatch = key.match(/^([^(]+)\(([^)]*)\)/)
                    if (methodMatch) {
                        const methodName = methodMatch[1].trim()
                        const paramStr = methodMatch[2]
                        const params = paramStr.split(',').map(p => p.trim()).filter(p => p)
                        // Handle array of statements for method body
                        let body = ''
                        if (Array.isArray(value)) {
                            const statements = value.map((stmt: any) => visit(stmt)).join(';\n    ')
                            body = statements
                        } else {
                            body = visit(value)
                        }


                        return `  ${methodName}(${params.join(', ')}) {\n    ${body}\n  }`
                    }
                }
                // Handle getters/setters
                else if (key.startsWith('get ') || key.startsWith('set ')) {
                    const [accessor, propName] = key.split(' ')
                    const body = Array.isArray(value) ? value.map((stmt: any) => visit(stmt)).join(';\n    ') : visit(value)


                    return `  ${accessor} ${propName}() {\n    ${body}\n  }`
                }
                // Handle static members
                else if (key.startsWith('static ')) {
                    const staticKey = key.substring(7)
                    if (staticKey.includes('(')) {
                        const methodMatch = staticKey.match(/^([^(]+)\(([^)]*)\)/)
                        if (methodMatch) {
                            const methodName = methodMatch[1].trim()
                            const paramStr = methodMatch[2]
                            const params = paramStr.split(',').map(p => p.trim()).filter(p => p)
                            const body = Array.isArray(value) ? value.map((stmt: any) => visit(stmt)).join(';\n    ') : visit(value)


                            return `  static ${methodName}(${params.join(', ')}) {\n    ${body}\n  }`
                        }
                    } else {
                        return `  static ${staticKey} = ${visit(value)}`
                    }
                }
                // Handle properties
                else {
                    return `  ${key} = ${visit(value)}`
                }
            })
        return `class ${className}${extendsClause} {\n${memberEntries.join('\n')}\n}`
    }

    // Handle class expressions (e.g., when class is a property of an object)
    if (op === 'class') {
        const className = keys.find(k => k !== 'class') || ''
        const classMembers = operands

        // Extract extends clause if present
        const extendsClause = classMembers['extends'] ? ` extends ${visit(classMembers['extends'])}` : ''

        const memberEntries = Object.entries(classMembers)
            .filter(([key]) => key !== 'extends') // Skip extends property
            .map(([key, value]) => {
                // Handle constructor
                if (key.startsWith('constructor(')) {
                    const paramMatch = key.match(/\(([^)]*)\)/)
                    const params = paramMatch ? paramMatch[1].split(',').map(p => p.trim()).filter(p => p) : []
                    const body = Array.isArray(value) ? value.map((stmt: any) => visit(stmt)).join(';\n    ') : visit(value)
                    return `  ${key.split('(')[0]}(${params.join(', ')}) {\n    ${body}\n  }`
                }
                // Handle methods
                else if (key.includes('(')) {
                    const methodMatch = key.match(/^([^(]+)\(([^)]*)\)/)
                    if (methodMatch) {
                        const methodName = methodMatch[1].trim()
                        const paramStr = methodMatch[2]
                        const params = paramStr.split(',').map(p => p.trim()).filter(p => p)
                        // Handle array of statements for method body
                        let body = ''
                        if (Array.isArray(value)) {
                            const statements = value.map((stmt: any) => visit(stmt)).join(';\n    ')
                            body = statements
                        } else {
                            body = visit(value)
                        }


                        return `  ${methodName}(${params.join(', ')}) {\n    ${body}\n  }`
                    }
                }
                // Handle getters/setters
                else if (key.startsWith('get ') || key.startsWith('set ')) {
                    const [accessor, propName] = key.split(' ')
                    const body = Array.isArray(value) ? value.map((stmt: any) => visit(stmt)).join(';\n    ') : visit(value)


                    return `  ${accessor} ${propName}() {\n    ${body}\n  }`
                }
                // Handle static members
                else if (key.startsWith('static ')) {
                    const staticKey = key.substring(7)
                    if (staticKey.includes('(')) {
                        const methodMatch = staticKey.match(/^([^(]+)\(([^)]*)\)/)
                        if (methodMatch) {
                            const methodName = methodMatch[1].trim()
                            const paramStr = methodMatch[2]
                            const params = paramStr.split(',').map(p => p.trim()).filter(p => p)
                            const body = Array.isArray(value) ? value.map((stmt: any) => visit(stmt)).join(';\n    ') : visit(value)


                            return `  static ${methodName}(${params.join(', ')}) {\n    ${body}\n  }`
                        }
                    } else {
                        return `  static ${staticKey} = ${visit(value)}`
                    }
                }
                // Handle properties
                else {
                    return `  ${key} = ${visit(value)}`
                }
            })

        // For anonymous class expressions, don't include the class name
        if (className === '') {
            return `class${extendsClause} {\n${memberEntries.join('\n')}\n}`
        } else {
            return `class ${className}${extendsClause} {\n${memberEntries.join('\n')}\n}`
        }
    }
    return ''
}
