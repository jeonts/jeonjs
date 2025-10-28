import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitPropertyDefinition(node: acorn.PropertyDefinition): any {
    // Handle class properties
    let propName = ''
    if (node.key.type === 'Identifier') {
        propName = (node.key as acorn.Identifier).name
    } else if (node.key.type === 'Literal') {
        propName = (node.key as acorn.Literal).value as string
    }

    // Prefix static properties with 'static '
    if (node.static) {
        propName = 'static ' + propName
    }

    return {
        [propName]: node.value ? ast2jeon(node.value) : null
    }
}