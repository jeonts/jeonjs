// Test the specific round trip case mentioned in the issue
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { convertToIIFE } from '../iifeConverter'

console.log('=== Round Trip Test for ((x) => { return (x * 2); })(4) ===\n')

const originalCode = '((x) => { return (x * 2); })(4)'

console.log('1. Original JavaScript code:')
console.log(originalCode)

try {
    // Step 1: Convert JavaScript to JEON
    console.log('\n2. Converting JavaScript to JEON:')
    const jeonResult = js2jeon(originalCode)
    console.log('JEON result:')
    console.log(JSON.stringify(jeonResult, null, 2))

    // Step 2: Convert JEON back to JavaScript
    console.log('\n3. Converting JEON back to JavaScript:')
    const jsResult = jeon2js(jeonResult)
    console.log(jsResult)

    // Step 3: Apply IIFE conversion
    console.log('\n4. Applying IIFE conversion:')
    const iifeResult = convertToIIFE(jsResult)
    console.log(iifeResult)

    console.log('\n=== Test Completed Successfully ===')

} catch (error: any) {
    console.log('\n❌ Error occurred:')
    console.log(error.message)
    console.log(error.stack)
}