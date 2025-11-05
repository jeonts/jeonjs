/**
 * Handles object conversion in JEON to JavaScript
 * @param keys The keys of the object
 * @param jeon The JEON object to convert
 * @param visit The visitor function to process nested elements
 * @param jsonImpl The JSON implementation to use (JSON or JSON5)
 * @param closure Whether to enable closure mode for safe evaluation (default: false)
 */
export function visitObject(keys: string[], jeon: any, visit: (item: any) => string, jsonImpl?: typeof JSON, closure: boolean = false): string {
    // Default object handling
    // Check if this object contains spread operators
    const hasSpread = keys.some(key => key === '...' || key.startsWith('...'))
    if (hasSpread) {
        // Handle object with spread operators
        const entries = []
        for (const [key, value] of Object.entries(jeon)) {
            if (key === '...') {
                entries.push(`...${visit(value)}`)
            } else if (key.startsWith('...')) {
                // Handle multiple spread operators (...1, ...2, etc.)
                entries.push(`...${visit(value)}`)
            } else {
                entries.push(`${(jsonImpl || JSON).stringify(key)}: ${visit(value)}`)
            }
        }
        return `{ ${entries.join(', ')} }`
    }

    // Regular object handling
    const entries = Object.entries(jeon).map(([key, value]) => {
        return `${(jsonImpl || JSON).stringify(key)}: ${visit(value)}`
    })
    return `{ ${entries.join(', ')} }`
}