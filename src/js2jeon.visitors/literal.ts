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

    // Check if this is a BigInt literal
    if (typeof node.value === 'bigint' || (node as any).bigint) {
        // For BigInt, we return the raw string representation with 'n' suffix
        // This allows JSON5 to handle it properly
        return node.raw || ((node as any).bigint + 'n')
    }

    return node.value
}