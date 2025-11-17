import { jeon2js } from '../jeon2js'

console.log('=== Testing jeon2js with CORRECT JEON ===')

// Correct JEON structure - each variable has its name as a key
const correctJeon: any = {
    "function sum(a, b)": [
        {
            "@": {
                "d": null
            }
        },
        {
            "@": {
                "e": null
            }
        },
        {
            "@": {
                "x": null
            }
        },
        {
            "@": {
                "y": null
            }
        },
        {
            "@@": {
                "f": 22
            }
        },
        {
            "@": {
                "g": null
            }
        },
        {
            "return": {
                "+": [
                    "@a",
                    "@b"
                ]
            }
        }
    ]
}

console.log('Correct JEON input:')
console.log(JSON.stringify(correctJeon, null, 2))

try {
    const result = jeon2js(correctJeon)
    console.log('\nJavaScript output:')
    console.log(result)
} catch (e: any) {
    console.log('Error:', e.message)
    console.log(e.stack)
}