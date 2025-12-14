// Import the functions we need
const { js2jeon } = require('./src/js2jeon')
const { evalJeon } = require('./src/safeEval')

// Define case34 directly
const case34 = {
    name: 'case34',
    code: `
function(...a) { return a }
`,
    jeon: {
        "function(...a)": [
            {
                "return": "@a"
            }
        ]
    },
    eval: undefined
}

console.log('Testing case34:')
console.log('Name:', case34.name)
console.log('Code:', case34.code)
console.log('Expected eval:', case34.eval)

try {
    console.log('\n--- Testing case34 ---')
    const generatedJeon = js2jeon(case34.code, { iife: true })
    console.log('Generated JEON:')
    console.log(JSON.stringify(generatedJeon, null, 2))

    const result = evalJeon(generatedJeon)
    console.log('\nResult:', result)
    console.log('Expected:', case34.eval)

    if (result === case34.eval) {
        console.log('✅ case34 PASSED')
    } else {
        console.log('❌ case34 FAILED')
    }
} catch (error: any) {
    console.error('❌ case34 ERROR:', error.message)
    console.error(error.stack)
}