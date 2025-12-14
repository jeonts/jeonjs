import { jeon2js } from '../jeon2js'
import { evalJeon } from '../safeEval'

console.log('=== Safe Evaluation Example ===')

// Example of a potentially dangerous JEON expression
const dangerousJeon = {
    'function dangerous()': {
        'return': 'alert("XSS Attack!")'
    }
}

console.log('\n1. Conversion:')
const js = jeon2js(dangerousJeon)
console.log(js)

console.log('\n2. Safe evaluation with evalJeon:')
// This would be the safe way to execute the function
const safeContext = {
    alert: (msg: string) => console.log(`Safe alert: ${msg}`)
}

// In a real application, you would use evalJeon to safely evaluate the JEON expression
console.log('To safely execute, use evalJeon(jeonExpression, context) instead of directly executing the generated JavaScript')

console.log('\n=== Safe Evaluation Example Completed ===')