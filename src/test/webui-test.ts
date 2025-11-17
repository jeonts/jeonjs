import { evalJeon } from '../safeEval'

// Test the JEON expression from the web UI
const jeon = {
  'function(a, b)': [
    { 'return': { '+': ['@a', '@b'] } }
  ]
}

console.log('=== Web UI Test ===')

// Test without context
console.log('Without context:')
let result = evalJeon(jeon, {})
console.log('Result type:', typeof result)
if (typeof result === 'function') {
  // Simulate what the web UI does - extract parameters and call with defaults
  const jeonKeys = Object.keys(jeon)
  const funcKey = jeonKeys.find(key => key.includes('=>') || key.startsWith('function'))
  console.log('Function key:', funcKey)

  if (funcKey) {
    // Extract parameter names from the function key
    let params: string[] = []
    if (funcKey.includes('=>')) {
      // Arrow function: "(a, b) =>"
      const paramMatch = funcKey.match(/\(([^)]*)\)/)
      params = paramMatch ? paramMatch[1].split(',').map(p => p.trim()).filter(p => p) : []
    } else if (funcKey.startsWith('function')) {
      // Traditional function: "function name(a, b)"
      const paramMatch = funcKey.match(/\(([^)]*)\)/)
      params = paramMatch ? paramMatch[1].split(',').map(p => p.trim()).filter(p => p) : []
    }
    console.log('Extracted params:', params)

    // Create arguments from context or use default values
    const context: Record<string, any> = {} // No context provided
    const args = params.map(param => {
      if (context.hasOwnProperty(param)) {
        return context[param]
      }
      // Default values for common parameter names
      switch (param) {
        case 'a': return 1
        case 'b': return 2
        case 'c': return 3
        case 'x': return 1
        case 'y': return 2
        case 'z': return 3
        default: return undefined
      }
    })
    console.log('Arguments to use:', args)

    // Call the function with the arguments
    console.log('Calling with default args (1, 2):', result(...args))
  }
}

// Test with context
console.log('\nWith context {a: 10, b: 20}:')
result = evalJeon(jeon, { a: 10, b: 20 })
console.log('Result type:', typeof result)
if (typeof result === 'function') {
  // The function should already have access to context values
  console.log('Calling with no arguments:', result())
  // Or call with explicit arguments
  console.log('Calling with 5, 7:', result(5, 7))
}