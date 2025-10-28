import { ast2jeon } from './ast2jeon'

export function visitJSXExpressionContainer(node: any): any {
    // Handle JSX expressions like {processData}
    if (node.expression.type === 'Identifier') {
        return `@${node.expression.name}`
    }
    return ast2jeon(node.expression)
}