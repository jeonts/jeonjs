import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitMethodDefinition(node: acorn.MethodDefinition): any {
    // Handle class methods, including async methods
    let methodKey = ''
    if (node.static) {
        methodKey = 'static '
    }

    // Handle async methods
    const isAsyncMethod = node.value && node.value.async ? 'async ' : ''

    if (node.kind === 'constructor') {
        methodKey += 'constructor(' + (node.value.params || []).map((p: any) => p.name).join(', ') + ')'
    } else if (node.kind === 'get') {
        let keyName = ''
        if (node.key.type === 'Identifier') {
            keyName = (node.key as acorn.Identifier).name
        } else if (node.key.type === 'Literal') {
            keyName = (node.key as acorn.Literal).value as string
        }
        methodKey += 'get ' + keyName
    } else if (node.kind === 'set') {
        let keyName = ''
        if (node.key.type === 'Identifier') {
            keyName = (node.key as acorn.Identifier).name
        } else if (node.key.type === 'Literal') {
            keyName = (node.key as acorn.Literal).value as string
        }
        methodKey += 'set ' + keyName +
            '(' + (node.value.params || []).map((p: any) => p.name).join(', ') + ')'
    } else {
        // Regular method
        let methodName = ''
        if (node.key.type === 'Identifier') {
            methodName = (node.key as acorn.Identifier).name
        } else if (node.key.type === 'Literal') {
            methodName = (node.key as acorn.Literal).value as string
        }
        methodKey += isAsyncMethod + methodName + '(' + (node.value.params || []).map((p: any) => p.name).join(', ') + ')'
    }

    // Convert method body
    // For methods, we need to extract just the function body statements, not the entire function expression
    const methodBody = Array.isArray(node.value.body.body) ?
        node.value.body.body.map((stmt: acorn.Node) => ast2jeon(stmt)) :
        [ast2jeon(node.value.body.body as unknown as acorn.Node)]

    const result = {
        [methodKey]: methodBody
    }

    return result
}