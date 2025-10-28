/**
 * Handles string conversion in JEON to JavaScript
 * @param jeon The string value to convert
 * @param jsonImpl The JSON implementation to use (JSON or JSON5)
 */
export function visitString(jeon: string, jsonImpl?: typeof JSON): string {
    // Handle references
    if (jeon.startsWith('@')) {
        return jeon.substring(1)
    }
    return (jsonImpl || JSON).stringify(jeon)
}