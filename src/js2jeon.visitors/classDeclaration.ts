import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitClassDeclaration(node: acorn.ClassDeclaration, options?: { json?: typeof JSON }): any {
    const className = node.id ? node.id.name : 'AnonymousClass'
    const classMembers: Record<string, any> = {}

    // Process class body
    if (node.body && node.body.body) {
        for (const member of node.body.body) {
            if (member.type === 'MethodDefinition') {
                // Handle methods, getters, setters
                let methodKey = ''
                if (member.static) {
                    // Prefix static methods with 'static '
                    methodKey = 'static '
                }

                // Handle async methods
                const isAsyncMethod = member.value && member.value.async ? 'async ' : ''

                if (member.kind === 'constructor') {
                    methodKey += 'constructor(' + (member.value.params || []).map((p: any) => {
                        if (p.type === 'Identifier') {
                            return (p as acorn.Identifier).name
                        }
                        return ast2jeon(p, options)
                    }).join(', ') + ')'
                } else if (member.kind === 'get') {
                    let keyName = ''
                    if (member.key.type === 'Identifier') {
                        keyName = (member.key as acorn.Identifier).name
                    } else if (member.key.type === 'Literal') {
                        keyName = (member.key as acorn.Literal).value as string
                    }
                    methodKey += 'get ' + keyName
                } else if (member.kind === 'set') {
                    let keyName = ''
                    if (member.key.type === 'Identifier') {
                        keyName = (member.key as acorn.Identifier).name
                    } else if (member.key.type === 'Literal') {
                        keyName = (member.key as acorn.Literal).value as string
                    }
                    methodKey += 'set ' + keyName +
                        '(' + (member.value.params || []).map((p: any) => {
                            if (p.type === 'Identifier') {
                                return (p as acorn.Identifier).name
                            }
                            return ast2jeon(p, options)
                        }).join(', ') + ')'
                } else {
                    // Regular method
                    let methodName = ''
                    if (member.key.type === 'Identifier') {
                        methodName = (member.key as acorn.Identifier).name
                    } else if (member.key.type === 'Literal') {
                        methodName = (member.key as acorn.Literal).value as string
                    }
                    methodKey += isAsyncMethod + methodName + '(' + (member.value.params || []).map((p: any) => {
                        if (p.type === 'Identifier') {
                            return (p as acorn.Identifier).name
                        }
                        return ast2jeon(p, options)
                    }).join(', ') + ')'
                }

                // Convert method body using BlockStatement visitor for proper variable grouping
                if (member.value.body.type === 'BlockStatement') {
                    const blockBody = member.value.body as acorn.BlockStatement
                    const methodBody = Array.isArray(blockBody.body) ?
                        blockBody.body.map(stmt => ast2jeon(stmt, options)) :
                        [ast2jeon(blockBody.body[0], options)]
                    classMembers[methodKey] = methodBody
                } else {
                    classMembers[methodKey] = [ast2jeon(member.value.body, options)]
                }
            } else if (member.type === 'PropertyDefinition') {
                // Handle class properties
                let propName = ''
                if (member.key.type === 'Identifier') {
                    propName = (member.key as acorn.Identifier).name
                } else if (member.key.type === 'Literal') {
                    propName = (member.key as acorn.Literal).value as string
                }
                // Prefix static properties with 'static '
                if (member.static) {
                    propName = 'static ' + propName
                }
                classMembers[propName] = member.value ? ast2jeon(member.value, options) : null
            }
        }
    }

    // Handle extends clause
    if (node.superClass) {
        classMembers['extends'] = ast2jeon(node.superClass, options)
    }

    // For class declarations, return an object with "class ClassName" as the key
    // This matches the pattern used for function declarations
    return {
        [`class ${className}`]: classMembers
    }
}
