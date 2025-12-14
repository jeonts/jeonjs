import { visitArrayPattern } from '../js2jeon.visitors/arrayPattern'
import * as acorn from 'acorn'

// Test simple array destructuring
const code = 'const [a, b] = [1, 2];'
const ast: any = acorn.parse(code, { ecmaVersion: 2020 })

// Extract the ArrayPattern node
const arrayPatternNode = ast.body[0].declarations[0].id

console.log('ArrayPattern node:', JSON.stringify(arrayPatternNode, null, 2))

const result = visitArrayPattern(arrayPatternNode)
console.log('visitArrayPattern result:', JSON.stringify(result, null, 2))