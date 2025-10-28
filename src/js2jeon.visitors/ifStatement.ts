import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitIfStatement(node: acorn.IfStatement, options?: { json?: typeof JSON }): any {
    const result: any = {
        'if': [
            ast2jeon(node.test, options),
            ast2jeon(node.consequent, options)
        ]
    }
    if (node.alternate) {
        result['if'][2] = ast2jeon(node.alternate, options)
    }
    return result
}