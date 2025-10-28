/**
 * Handles primitive value conversion in JEON to JavaScript
 * @param jeon The primitive value to convert
 * @param jsonImpl The JSON implementation to use (JSON or JSON5)
 */
export function visitPrimitive(jeon: any, jsonImpl?: typeof JSON): string {
    if (typeof jeon === 'number' || typeof jeon === 'boolean' || jeon === null) {
        return (jsonImpl || JSON).stringify(jeon)
    }
    return ''
}