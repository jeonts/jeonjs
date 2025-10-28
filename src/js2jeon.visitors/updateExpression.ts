import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitUpdateExpression(node: acorn.UpdateExpression, options?: { json?: typeof JSON }): any {
    return {
        [node.operator]: ast2jeon(node.argument, options)
    }
}