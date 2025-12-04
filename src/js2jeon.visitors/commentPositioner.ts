import * as acorn from 'acorn'

/**
 * Represents a comment node extracted by Acorn
 */
export interface AcornComment {
    type: 'Line' | 'Block'
    value: string
    start: number
    end: number
}

/**
 * Represents a synthetic comment node
 */
interface CommentNode {
    type: 'CommentNode'
    commentType: 'Line' | 'Block'
    value: string
    start: number
    end: number
}

/**
 * Helper function to insert standalone comments into an array at the appropriate position
 * @param array The array to insert comments into
 * @param commentNodes The comment nodes to insert
 */
function insertCommentsIntoArray(array: any[], commentNodes: CommentNode[]): void {
    // Sort comments by position
    commentNodes.sort((a, b) => a.start - b.start)

    // For each comment, find the appropriate position in the array
    // Only insert standalone comments, not inline comments
    for (const comment of commentNodes) {
        // Check if this is likely a standalone comment
        // Standalone comments are typically at the beginning of a line or after certain delimiters
        // For now, we'll insert all comments, but in the future we might want to filter
        // Find the element that comes after this comment
        let insertIndex = array.length
        for (let i = 0; i < array.length; i++) {
            const element = array[i]
            if (element && typeof element.start === 'number' && element.start > comment.end) {
                insertIndex = i
                break
            }
        }

        // Insert the comment node at the appropriate position
        array.splice(insertIndex, 0, comment)
    }
}

/**
 * Inserts comment nodes into the AST structure at the appropriate position
 * @param node The AST node to insert comments into
 * @param commentNodes The comment nodes to insert
 */
function insertCommentNodes(node: any, commentNodes: CommentNode[]): void {
    // For nodes with properties array (like ObjectExpression), insert comments into the properties array
    if (Array.isArray(node.properties)) {
        insertCommentsIntoArray(node.properties, commentNodes)
    }
    // For program nodes, insert comments into the body array
    else if (Array.isArray(node.body)) {
        insertCommentsIntoArray(node.body, commentNodes)
    }
    // For other nodes with array structures, we don't insert comments to avoid inline comment issues
    else {
        // Comments are intentionally not inserted into other array structures
        // This prevents inline comments from being inserted as separate array elements
        // They will be handled by the specific node processors or discarded
    }
}

/**
 * Traverses the AST and associates comments with nodes based on their positions
 * @param node The AST node to traverse
 * @param comments Array of comment nodes extracted by Acorn
 * @param consumedComments Set of comment indices that have already been assigned
 * @returns The AST node with comments associated
 */
export function positionCommentsInAST(node: any, comments: AcornComment[], consumedComments: Set<number> = new Set()): any {
    if (!node || typeof node !== 'object') {
        return node
    }

    // Recursively traverse child nodes FIRST to consume comments at the most specific level
    for (const key in node) {
        if (node.hasOwnProperty(key) && key !== 'comments') {
            const value = node[key]
            if (Array.isArray(value)) {
                node[key] = value.map(item => positionCommentsInAST(item, comments, consumedComments))
            } else if (value && typeof value === 'object' && !(value instanceof RegExp)) {
                node[key] = positionCommentsInAST(value, comments, consumedComments)
            }
        }
    }

    // AFTER traversing children, check if this node should have comments
    if (typeof node.start === 'number' && typeof node.end === 'number') {
        // Find comments that are within this node's range but not yet consumed
        const commentsWithinNode: AcornComment[] = []
        comments.forEach((comment, index) => {
            if (!consumedComments.has(index) &&
                comment.start >= node.start &&
                comment.end <= node.end) {
                commentsWithinNode.push(comment)
                consumedComments.add(index)
            }
        })

        if (commentsWithinNode.length > 0) {
            // Create synthetic comment nodes and insert them into the AST
            const commentNodes: CommentNode[] = commentsWithinNode.map(comment => ({
                type: 'CommentNode',
                commentType: comment.type,
                value: comment.value.trim(),
                start: comment.start,
                end: comment.end
            }))

            // Insert comment nodes into the AST structure at the appropriate position
            insertCommentNodes(node, commentNodes)
        }
    }

    return node
}