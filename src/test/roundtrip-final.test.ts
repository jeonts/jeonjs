import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'

console.log('=== Final Round-trip Test ===')

// Test the specific case mentioned in the issue
const code = `function sum(a, b) {
let d;
const f = 22;
var g;  
return a + b;}
function min(a, b){
return Math.min(a,b)
}
function main(a, b){
return min(sum(a,b))
}`

console.log('Original code:')
console.log(code)

try {
    // Convert JS to JEON
    const jeon = js2jeon(code)
    console.log('\nJEON output:')
    console.log(JSON.stringify(jeon, null, 2))

    // Convert JEON back to JS
    const regenerated = jeon2js(jeon)
    console.log('\nRegenerated code:')
    console.log(regenerated)

    // Check that the conversion is correct
    const expectedFeatures = [
        'let d;',           // let declaration preserved
        'const f = 22;',    // const declaration preserved
        'let g;',           // var converted to let (as requested)
        'return a + b',     // return statement preserved
        'Math.min(a, b)',   // function call preserved
        'min(sum(a, b))'    // nested function calls preserved
    ]

    let allFeaturesPresent = true
    for (const feature of expectedFeatures) {
        if (!regenerated.includes(feature)) {
            console.log(`❌ Missing feature: ${feature}`)
            allFeaturesPresent = false
        }
    }

    if (allFeaturesPresent) {
        console.log('\n✅ All features correctly preserved in round-trip conversion!')
    }

    // Verify JEON structure is simplified
    const jeonString = JSON.stringify(jeon)
    if (!jeonString.includes('"@@@"')) {
        console.log('✅ JEON structure simplified - no @@@ operator used')
    } else {
        console.log('❌ JEON structure still contains @@@ operator')
    }

    if (jeonString.includes('"@":{}') && jeonString.includes('"@@":')) {
        console.log('✅ JEON structure correctly uses @ for let/var and @@ for const')
    } else {
        console.log('❌ JEON structure does not correctly distinguish let/var from const')
    }

} catch (e: any) {
    console.log('Error:', e.message)
    console.log(e.stack)
}