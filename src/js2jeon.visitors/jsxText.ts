import { ast2jeon } from './ast2jeon'

export function visitJSXText(node: any): any {
    return node.value.trim()
}