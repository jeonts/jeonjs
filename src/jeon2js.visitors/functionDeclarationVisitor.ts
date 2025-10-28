/**
 * Handles function declaration conversion in JEON to JavaScript
 * @param keys The keys of the JEON object
 * @param jeon The JEON object containing the function declaration
 * @param visit The visitor function to process nested elements
 * @param jsonImpl The JSON implementation to use (JSON or JSON5)
 */
export function visitFunctionDeclaration(keys: string[], jeon: any, visit: (item: any) => string, jsonImpl?: typeof JSON): string | null {
    // Handle function declarations at the top level
    for (const key of keys) {
        if (key.startsWith('function') || key.startsWith('async function') || key.startsWith('function*')) {
            const paramMatch = key.match(/\(([^)]*)\)/)
            const params = paramMatch ? paramMatch[1].split(',').map((p: string) => p.trim()).filter((p: string) => p) : []
            const body = jeon[key]
            const bodyStr = Array.isArray(body) ? body.map((stmt: any) => visit(stmt)).join(';\n  ') : visit(body)
            return `${key.split('(')[0]}(${params.join(', ')}) {\n  ${bodyStr}\n}`
        }
    }
    return null
}