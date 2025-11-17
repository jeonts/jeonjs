import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

// Test how Acorn parses parentheses with preserveParens option
const code1 = '({})'
const code2 = '(1+2)'

const Parser = acorn.Parser.extend(jsx())

console.log('Testing empty object in parentheses (with preserveParens=true):')
try {
    const ast1 = Parser.parse(code1, {
        ecmaVersion: 'latest',
        sourceType: 'module',
        preserveParens: true
    })
    console.log(JSON.stringify(ast1, null, 2))
} catch (e: any) {
    console.log('Error:', e.message)
}

console.log('\nTesting binary expression in parentheses (with preserveParens=true):')
try {
    const ast2 = Parser.parse(code2, {
        ecmaVersion: 'latest',
        sourceType: 'module',
        preserveParens: true
    })
    console.log(JSON.stringify(ast2, null, 2))
} catch (e: any) {
    console.log('Error:', e.message)
}