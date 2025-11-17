import { js2jeon } from '../js2jeon'

// Test to see what the AST looks like with comments
const code = `
// This is a line comment
const x = 42;
`

const jeon = js2jeon(code)
console.log('JEON output:', JSON.stringify(jeon, null, 2))