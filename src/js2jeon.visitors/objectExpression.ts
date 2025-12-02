import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitObjectExpression(node: acorn.ObjectExpression & { comments?: any[] }, options?: { json?: typeof JSON }): any {
    const obj: Record<string, any> = {}
    let spreadIndex = 0

    // Process properties and comment nodes
    for (const prop of node.properties) {
        // Handle comment nodes that we inserted
        if ((prop as any).type === 'CommentNode') {
            // For comment nodes, we need to handle them specially
            // We'll add them as a special marker that the object visitor can recognize
            const commentNode = prop as any
            // Create a unique key for each comment to avoid conflicts
            const commentKey = `__COMMENT_${node.properties.indexOf(prop)}__`
            obj[commentKey] = {
                __comment__: true,
                type: commentNode.commentType,
                value: commentNode.value
            }
        }
        else if (prop.type === 'Property') {
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

    // Handle comments within the object literal (legacy approach)
    if (node.comments && node.comments.length > 0) {
        // Filter out comments that are just whitespace
        const nonEmptyComments = node.comments.filter((comment: any) => comment.value.trim() !== '')
        if (nonEmptyComments.length > 0) {
            // Add comments to the object
            return {
                '//': nonEmptyComments.map((comment: any) => comment.value),
                ...obj
            }
        }
    }

    return obj
}