/**
 * Handles comment node conversion in js2jeon
 * @param node The comment node to convert
 * @returns The JEON representation of the comment
 */
export function visitCommentNode(node: any): any {
    // Return a special JEON structure for comments
    // This will be handled specially during JEON to JS conversion
    if (node.commentType === 'Line') {
        return {
            '//': node.value
        }
    } else if (node.commentType === 'Block') {
        return {
            '/*': node.value.split('\n')
        }
    }

    // Fallback for unknown comment types
    return {
        '//': node.value
    }
}