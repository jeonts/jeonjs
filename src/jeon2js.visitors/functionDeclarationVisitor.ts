/**
 * Handles function declaration conversion in JEON to JavaScript
 * @param keys The keys of the JEON object
 * @param jeon The JEON object containing the function declaration
 * @param visit The visitor function to process nested elements
 * @param jsonImpl The JSON implementation to use (JSON or JSON5)
 * @param closure Whether to enable closure mode for safe evaluation (default: false)
 */
export function visitFunctionDeclaration(keys: string[], jeon: any, visit: (item: any) => string, jsonImpl?: typeof JSON, closure: boolean = false): string | null {
    // Handle function declarations at the top level
    for (const key of keys) {
        if (key.startsWith('function') || key.startsWith('async function') || key.startsWith('function*')) {
            // Validate function signature syntax
            const paramMatch = key.match(/\(([^)]*)\)/)
            if (!paramMatch) {
                throw new Error(`Invalid function signature: ${key}`)
            }

            // Validate parameter syntax
            const paramStr = paramMatch[1]
            if (paramStr) {
                // Check for valid parameter names (simple validation)
                const params = paramStr.split(',').map((p: string) => p.trim()).filter((p: string) => p)
                for (const param of params) {
                    // Parameter names should be valid identifiers
                    if (!/^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(param)) {
                        throw new Error(`Invalid parameter name '${param}' in function signature: ${key}`)
                    }
                }
            }

            const params = paramStr ? paramStr.split(',').map((p: string) => p.trim()).filter((p: string) => p) : []
            const body = jeon[key]
            const bodyStr = Array.isArray(body) ? body.map((stmt: any) => visit(stmt)).join('\n  ') : visit(body)

            // If closure mode is enabled, wrap the function in evalJeon
            if (closure) {
                // Create a function that calls evalJeon with the body and parameters
                const contextObj = params.map(p => `${p}: ${p}`).join(', ')

                // Extract the actual JEON body object (handle array-wrapped bodies)
                let jeonBody = body
                if (Array.isArray(body) && body.length === 1 && typeof body[0] === 'object' && body[0] !== null) {
                    jeonBody = body[0]
                }

                // Use JSON.stringify with indentation to preserve formatting
                const formattedBody = jsonImpl ? jsonImpl.stringify(jeonBody, null, 2) : JSON.stringify(jeonBody, null, 2)
                return `${key.split('(')[0]}(${params.join(', ')}) { return evalJeon(${formattedBody}, {${contextObj}}); }`
            }

            return `${key.split('(')[0]}(${params.join(', ')}) {\n  ${bodyStr}\n}`
        }
    }
    return null
}