import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

console.log('=== Debug Destructuring AST ===\n')

const code = `
const {a,b} = {a:1, b:3}
a+b
`

console.log('Code:')
console.log(code)

try {
  // Parse the code using Acorn with JSX support
  const Parser = acorn.Parser.extend(jsx())
  const ast: any = Parser.parse(code, {
    ecmaVersion: 'latest',
    sourceType: 'module',
    allowReturnOutsideFunction: true,
    preserveParens: true,
    onComment: [] // Collect comments
  })
  
  console.log('\nAST:')
  console.log(JSON.stringify(ast, null, 2))
} catch (error: any) {
  console.error('Error parsing code:', error)
}