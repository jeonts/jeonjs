import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitObjectExpression(node: acorn.ObjectExpression, options?: { json?: typeof JSON }): any {
    const obj: Record<string, any> = {}
    let spreadIndex = 0
    for (const prop of node.properties) {
        if (prop.type === 'Property') {
            const key = prop.key.type === 'Identifier' ? (prop.key as acorn.Identifier).name : (prop.key as acorn.Literal).value as string
            obj[key] = ast2jeon(prop.value, options)
        } else if (prop.type === 'SpreadElement') {
            // Handle spread operator
            // For multiple spread elements, we need to create a unique key
            const spreadKey = spreadIndex === 0 ? '...' : `...${spreadIndex}`
            obj[spreadKey] = ast2jeon((prop as acorn.SpreadElement).argument, options)
            spreadIndex++
        }
    }
    return obj
}