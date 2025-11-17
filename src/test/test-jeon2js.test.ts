import { jeon2js } from '../jeon2js'

console.log('=== Testing jeon2js with provided JEON ===')

const jeon: any = {
    "function sum(a, b)": [
        {
            "@": {}
        },
        {
            "@": {}
        },
        {
            "@": {}
        },
        {
            "@": {}
        },
        {
            "@@": {
                "f": 22
            }
        },
        {
            "@": {}
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

console.log('JEON input:')
console.log(JSON.stringify(jeon, null, 2))

try {
    const result = jeon2js(jeon)
    console.log('\nJavaScript output:')
    console.log(result)
} catch (e: any) {
    console.log('Error:', e.message)
    console.log(e.stack)
}