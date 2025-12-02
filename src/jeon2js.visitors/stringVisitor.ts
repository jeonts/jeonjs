/**
 * Handles string conversion in JEON to JavaScript
 * @param jeon The string value to convert
 * @param jsonImpl The JSON implementation to use (JSON or JSON5)
 */
export function visitString(jeon: string, jsonImpl?: typeof JSON): string {
    // Handle empty statements
    if (jeon === ';') {
        return ';'  // Empty statements should produce a semicolon
    }

    // Handle BigInt strings - strings that end with 'n' and represent BigInt literals
    if (jeon.endsWith('n') && jeon.length > 1) {
        // Check if the part before 'n' is a valid integer (possibly negative)
        const bigintPart = jeon.slice(0, -1)
        if (/^-?\d+$/.test(bigintPart)) {
            // This is a BigInt literal, return it without quotes
            return jeon
        }
    }

    // Handle references - no shortcuts allowed, must use explicit '.' operator
    if (jeon.startsWith('@')) {
        const cleanName = jeon.substring(1)
        // Reject shortcuts like @this.name - must use explicit { '.': ['@this', 'name'] }
        if (cleanName.includes('.')) {
            throw new Error(`Invalid reference '${jeon}': member access shortcuts not allowed. Use explicit '.' operator: { ".": ["@${cleanName.split('.')[0]}", ...] }`)
        }
        return cleanName
    }
    return (jsonImpl || JSON).stringify(jeon)
}