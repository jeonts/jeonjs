import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

// Test comment collection directly
const code = `
// This is a line comment
const x = 42;
`

const comments: any[] = []

const Parser = acorn.Parser.extend(jsx())
const ast: any = Parser.parse(code, {
    ecmaVersion: 'latest',
    sourceType: 'module',
    allowReturnOutsideFunction: true,
    preserveParens: true,
    onComment: comments
})

console.log('AST:', JSON.stringify(ast, null, 2))
console.log('Comments:', JSON.stringify(comments, null, 2))

// Check if comments are attached to the AST
console.log('AST with comments:', ast.comments)