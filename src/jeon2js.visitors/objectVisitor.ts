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
        const formattedEntries = []

        // First, format all entries and check if any need line breaks
        let needsLineBreaks = false
        for (const key of keys) {
            let formattedValue
            if (key === '...') {
                formattedValue = `...${visit(jeon[key])}`
            } else if (key.startsWith('...')) {
                // Handle multiple spread operators (...1, ...2, etc.)
                formattedValue = `...${visit(jeon[key])}`
            } else {
                formattedValue = `${formatKey(key)}:${visit(jeon[key])}`
            }
            formattedEntries.push(formattedValue)

            // Check if this value contains spaces (multi-word) or newlines
            if (formattedValue.includes(' ') || formattedValue.includes('\n')) {
                needsLineBreaks = true
            }
        }

        // Then build the entries with proper formatting
        for (let i = 0; i < formattedEntries.length; i++) {
            const entry = formattedEntries[i]
            if (needsLineBreaks && i < formattedEntries.length - 1) {
                // For objects with multi-word values, put comma on next line
                entries.push(entry + ',\n')
            } else {
                // For single-word values or last entry, keep commas on same line
                entries.push(entry)
            }
        }

        if (needsLineBreaks) {
            // For objects with multi-word values, format with line breaks
            return `{${entries.join('')}}`
        } else {
            // All entries are single line, join with commas
            return `{${entries.join(',')}}`
        }
    }

    // Regular object handling
    const entries = []
    const formattedEntries = []

    // First, format all entries and check if any need line breaks
    let needsLineBreaks = false
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const value = jeon[key]
        // Handle synthetic comment nodes in objects
        if (key.startsWith('__COMMENT_') && value && typeof value === 'object' && (value as any).__comment__) {
            // This is a synthetic comment node, format it properly
            const comment = value as any
            if (comment.type === 'Line') {
                // For inline comments, format without newlines so they stay with the previous property
                formattedEntries.push(` //${comment.value}`)
            } else if (comment.type === 'Block') {
                // Add a newline before and after the comment for proper formatting
                formattedEntries.push(`\n/*${comment.value}*/\n`)
            }
            continue
        }

        const formattedValue = visit(value)
        const entry = `${formatKey(key)}:${formattedValue}`
        formattedEntries.push(entry)

        // Check if this value contains spaces (multi-word) or newlines
        if (formattedValue.includes(' ') || formattedValue.includes('\n')) {
            needsLineBreaks = true
        }
    }

    // Then build the entries with proper formatting
    for (let i = 0; i < formattedEntries.length; i++) {
        const entry = formattedEntries[i]
        if (needsLineBreaks && i < formattedEntries.length - 1) {
            // For objects with multi-word values, put comma on next line
            entries.push(entry + ',\n')
        } else {
            // For single-word values or last entry, keep commas on same line
            entries.push(entry)
        }
    }

    if (needsLineBreaks) {
        // For objects with multi-word values, format with line breaks
        return `{${entries.join('')}}`
    } else {
        // All entries are single line, join with commas
        return `{${entries.join(',')}}`
    }
}