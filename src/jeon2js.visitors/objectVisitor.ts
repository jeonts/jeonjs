/**
 * Handles object conversion in JEON to JavaScript
 * @param keys The keys of the object
 * @param jeon The JEON object to convert
 * @param visit The visitor function to process nested elements
 * @param jsonImpl The JSON implementation to use (JSON or JSON5)
 * @param closure Whether to enable closure mode for safe evaluation (default: false)
 */
export function visitObject(keys: string[], jeon: any, visit: (item: any) => string, jsonImpl?: typeof JSON, closure: boolean = false): string {
    // Helper function to format object keys appropriately
    const formatKey = (key: string): string => {
        // Check if the key is a valid JavaScript identifier
        // Valid identifiers start with a letter, underscore, or $, followed by letters, digits, underscores, or $
        if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) &&
            !['break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield', 'let', 'static', 'await', 'enum'].includes(key)) {
            // Valid identifier that's not a reserved word - no quotes needed
            return key
        }
        // Check if the key is a valid numeric key (non-negative integer)
        else if (/^(0|[1-9]\d*)$/.test(key)) {
            // Valid numeric key - no quotes needed
            return key
        }
        else {
            // Not a valid identifier or is a reserved word - use JSON.stringify
            return (jsonImpl || JSON).stringify(key)
        }
    }

    // Default object handling
    // Check if this object contains spread operators
    const hasSpread = keys.some(key => key === '...' || key.startsWith('...'))
    if (hasSpread) {
        // Handle object with spread operators
        const entries = []
        // Iterate through keys in their original order to preserve position of spread operators
        for (const key of keys) {
            const value = jeon[key]
            if (key === '...') {
                entries.push(`...${visit(value)}`)
            } else if (key.startsWith('...')) {
                // Handle multiple spread operators (...1, ...2, etc.)
                entries.push(`...${visit(value)}`)
            } else {
                entries.push(`${formatKey(key)}:${visit(value)}`)
            }
        }
        return `{${entries.join(',')}}`
    }

    // Regular object handling
    const entries = keys.map(key => {
        const value = jeon[key]
        // Handle synthetic comment nodes in objects
        if (key.startsWith('__COMMENT_') && value && typeof value === 'object' && (value as any).__comment__) {
            // This is a synthetic comment node, format it properly
            const comment = value as any
            if (comment.type === 'Line') {
                // Add a newline before and after the comment for proper formatting
                return `\n//${comment.value}\n`
            } else if (comment.type === 'Block') {
                // Add a newline before and after the comment for proper formatting
                return `\n/*${comment.value}*/\n`
            }
        }
        return `${formatKey(key)}:${visit(value)}`
    })
    return `{${entries.join(',')}}`
}