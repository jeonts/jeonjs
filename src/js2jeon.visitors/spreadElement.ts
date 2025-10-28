import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitSpreadElement(node: acorn.SpreadElement, options?: { json?: typeof JSON }): any {
    return {
        '...': ast2jeon(node.argument, options)
    }
}