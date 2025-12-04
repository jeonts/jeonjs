/**
 * Handles class conversion in JEON to JavaScript
 * @param op The operator (class ClassName)
 * @param operands The operands for the class (class members)
 * @param keys The keys of the JEON object
 * @param visit The visitor function to process nested elements
 * @param jsonImpl The JSON implementation to use (JSON or JSON5)
 * @param closure Whether to enable closure mode for safe evaluation (default: false)
 */
export function visitClass(op: string, operands: any, keys: string[], visit: (item: any) => string, jsonImpl?: typeof JSON, closure: boolean = false): string {
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

                        // If closure mode is enabled, wrap the method in evalJeon
                        if (closure) {
                            // Pass only the function body (value) to evalJeon
                            // Include 'this' in the context for class methods
                            if (params.length > 0) {
                                // Create context object that includes both parameters and this
                                const contextParams = params.map(p => `"${p}": ${p}`).join(', ')
                                return `  ${methodName}(${params.join(', ')}) { return evalJeon(${JSON.stringify(value)}, {${contextParams}, this: this}); }`
                            } else {
                                return `  ${methodName}(${params.join(', ')}) { return evalJeon(${JSON.stringify(value)}, {this: this}); }`
                            }
                        }

                        return `  ${methodName}(${params.join(', ')}) {\n    ${body}\n  }`
                    }
                }
                // Handle getters/setters
                else if (key.startsWith('get ') || key.startsWith('set ')) {
                    const [accessor, propName] = key.split(' ')
                    const body = Array.isArray(value) ? value.map((stmt: any) => visit(stmt)).join(';\n    ') : visit(value)

                    // If closure mode is enabled, wrap the getter/setter in evalJeon
                    if (closure) {
                        // Pass only the function body (value) to evalJeon
                        if (accessor === 'get') {
                            // For getters, include 'this' in the context
                            return `  ${accessor} ${propName}() { return evalJeon(${JSON.stringify(value)}, {this: this}); }`
                        } else {
                            // For setter, extract the parameter name and pass it
                            const paramMatch = key.match(/\(([^)]*)\)/)
                            const param = paramMatch ? paramMatch[1] : ''
                            // For setters, include both the parameter and 'this' in the context
                            if (param) {
                                return `  ${accessor} ${propName}(${param}) { return evalJeon(${JSON.stringify(value)}, {"${param}": ${param}, this: this}); }`
                            } else {
                                return `  ${accessor} ${propName}(${param}) { return evalJeon(${JSON.stringify(value)}, {this: this}); }`
                            }
                        }
                    }

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

                            // If closure mode is enabled, wrap the static method in evalJeon
                            if (closure) {
                                // Pass only the function body (value) to evalJeon
                                if (params.length > 0) {
                                    const contextParams = params.map(p => `"${p}": ${p}`).join(', ')
                                    return `  static ${methodName}(${params.join(', ')}) { return evalJeon(${JSON.stringify(value)}, {${contextParams}}); }`
                                } else {
                                    return `  static ${methodName}(${params.join(', ')}) { return evalJeon(${JSON.stringify(value)}, {}); }`
                                }
                            }

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

                        // If closure mode is enabled, wrap the method in evalJeon
                        if (closure) {
                            // Pass only the function body (value) to evalJeon
                            // Include 'this' in the context for class methods
                            if (params.length > 0) {
                                // Create context object that includes both parameters and this
                                const contextParams = params.map(p => `"${p}": ${p}`).join(', ')
                                return `  ${methodName}(${params.join(', ')}) { return evalJeon(${JSON.stringify(value)}, {${contextParams}, this: this}); }`
                            } else {
                                return `  ${methodName}(${params.join(', ')}) { return evalJeon(${JSON.stringify(value)}, {this: this}); }`
                            }
                        }

                        return `  ${methodName}(${params.join(', ')}) {\n    ${body}\n  }`
                    }
                }
                // Handle getters/setters
                else if (key.startsWith('get ') || key.startsWith('set ')) {
                    const [accessor, propName] = key.split(' ')
                    const body = Array.isArray(value) ? value.map((stmt: any) => visit(stmt)).join(';\n    ') : visit(value)

                    // If closure mode is enabled, wrap the getter/setter in evalJeon
                    if (closure) {
                        // Pass only the function body (value) to evalJeon
                        if (accessor === 'get') {
                            // For getters, include 'this' in the context
                            return `  ${accessor} ${propName}() { return evalJeon(${JSON.stringify(value)}, {this: this}); }`
                        } else {
                            // For setter, extract the parameter name and pass it
                            const paramMatch = key.match(/\(([^)]*)\)/)
                            const param = paramMatch ? paramMatch[1] : ''
                            // For setters, include both the parameter and 'this' in the context
                            if (param) {
                                return `  ${accessor} ${propName}(${param}) { return evalJeon(${JSON.stringify(value)}, {"${param}": ${param}, this: this}); }`
                            } else {
                                return `  ${accessor} ${propName}(${param}) { return evalJeon(${JSON.stringify(value)}, {this: this}); }`
                            }
                        }
                    }

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

                            // If closure mode is enabled, wrap the static method in evalJeon
                            if (closure) {
                                // Pass only the function body (value) to evalJeon
                                if (params.length > 0) {
                                    const contextParams = params.map(p => `"${p}": ${p}`).join(', ')
                                    return `  static ${methodName}(${params.join(', ')}) { return evalJeon(${JSON.stringify(value)}, {${contextParams}}); }`
                                } else {
                                    return `  static ${methodName}(${params.join(', ')}) { return evalJeon(${JSON.stringify(value)}, {}); }`
                                }
                            }

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
