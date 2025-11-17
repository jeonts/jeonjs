import * as acorn from 'acorn'

export function visitLiteral(node: acorn.Literal, options?: { json?: typeof JSON }): any {
    // Check if this is a regex literal
    if (node.regex) {
        // Return a JEON object with the / / operator for regex
        return {
            '/ /': {
                pattern: node.regex.pattern,
                flags: node.regex.flags
            }
        }
    }

    return node.value
}