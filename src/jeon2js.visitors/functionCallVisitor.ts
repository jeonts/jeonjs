/**
 * Handles function call conversion in JEON to JavaScript
 * @param keys The keys of the JEON object
 * @param jeon The JEON object containing the function call
 * @param visit The visitor function to process nested elements
 * @param jsonImpl The JSON implementation to use (JSON or JSON5)
 */
export function visitFunctionCall(keys: string[], jeon: any, visit: (item: any) => string, jsonImpl?: typeof JSON): string {
    // Handle function calls (fn())
    const functionCallKey = keys.find(key => key.endsWith('()'))
    if (functionCallKey) {
        const functionName = functionCallKey.substring(0, functionCallKey.length - 2)
        const functionArgs = jeon[functionCallKey]
        const args = Array.isArray(functionArgs) ? functionArgs.map((arg: any) => visit(arg)) : []
        return `${functionName}(${args.join(', ')})`
    }
    return ''
}