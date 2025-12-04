// Test full IIFE detection and conversion flow

import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'

// Test the complete flow of IIFE handling
console.log('Testing complete IIFE detection and conversion flow:')

// Test case 1: Simple IIFE
const iifeCode = "(function() { return 'Hello, JEON!'; })()"
console.log('\n1. Original IIFE code:')
console.log(iifeCode)

// Convert JavaScript to JEON (this should detect and unwrap the IIFE)
const jeonResult = js2jeon(iifeCode)
console.log('\n2. JEON conversion result:')
console.log(JSON.stringify(jeonResult, null, 2))

// Convert JEON back to JavaScript
const jsResult = jeon2js(jeonResult)
console.log('\n3. Back to JavaScript:')
console.log(jsResult)

// Test case 2: Arrow function IIFE
const arrowIIFECode = "(() => { const x = 42; return x * 2; })()"
console.log('\n4. Original arrow IIFE code:')
console.log(arrowIIFECode)

// Convert JavaScript to JEON
const jeonResult2 = js2jeon(arrowIIFECode)
console.log('\n5. JEON conversion result:')
console.log(JSON.stringify(jeonResult2, null, 2))

// Convert JEON back to JavaScript
const jsResult2 = jeon2js(jeonResult2)
console.log('\n6. Back to JavaScript:')
console.log(jsResult2)

// Test case 3: Regular function (for comparison)
const regularFunctionCode = "function greet() { return 'Hello, World!'; }"
console.log('\n7. Original regular function code:')
console.log(regularFunctionCode)

// Convert JavaScript to JEON
const jeonResult3 = js2jeon(regularFunctionCode)
console.log('\n8. JEON conversion result:')
console.log(JSON.stringify(jeonResult3, null, 2))

// Convert JEON back to JavaScript
const jsResult3 = jeon2js(jeonResult3)
console.log('\n9. Back to JavaScript:')
console.log(jsResult3)