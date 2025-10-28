import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitClassExpression(node: acorn.ClassExpression): any {
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
                    methodKey += 'constructor(' + (member.value.params || []).map((p: any) => p.name).join(', ') + ')'
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
                        '(' + (member.value.params || []).map((p: any) => p.name).join(', ') + ')'
                } else {
                    // Regular method
                    let methodName = ''
                    if (member.key.type === 'Identifier') {
                        methodName = (member.key as acorn.Identifier).name
                    } else if (member.key.type === 'Literal') {
                        methodName = (member.key as acorn.Literal).value as string
                    }
                    methodKey += isAsyncMethod + methodName + '(' + (member.value.params || []).map((p: any) => p.name).join(', ') + ')'
                }

                // Convert method body directly instead of the entire function expression
                const methodBody = Array.isArray(member.value.body.body) ?
                    member.value.body.body.map(ast2jeon) :
                    [ast2jeon(member.value.body.body as unknown as acorn.Node)]

                classMembers[methodKey] = methodBody
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
                classMembers[propName] = member.value ? ast2jeon(member.value) : null
            }
        }
    }

    // For ClassExpression, return the class object directly
    return {
        'class': classMembers
    }
}