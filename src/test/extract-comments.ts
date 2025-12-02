import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

// Test the complex object with various built-in types
const jsCode = `
// Some of the built-in JavaScript types that get encoded

const item = { foo: 1 };

return {
  date: new Date("2025-01-01T00:00:00.000Z"),
  regexp2: /hello world/,
  regexp: /hello world/gi,
  error: new Error("Something went wrong", { cause: 404 }),
  url: new URL("https://example.com/path?query=value"),
  urlSearchParams: new URLSearchParams("query=value&another=value"),
  bigint: 1234567890123456789n,
  symbol: Symbol.for("test"),
  undefined: undefined,
  // None of those are handled by normal JSON.stringify
  specialNumbers: [Infinity, -Infinity, -0, NaN],
  someData: new Uint8Array([1, 2, 3, 4, 5]),
  set: new Set([1, 2, 3]),
  map: new Map([[1, 1], [2, 2]]),
  sameRefs: [item, item, item],
  sparsedArray: [0,,, undefined, 0]
}
`

console.log('Original JavaScript:')
console.log(jsCode)

// Array to collect comments
const comments: any[] = []

// Parse the code
const Parser = acorn.Parser.extend(jsx())
const ast: any = Parser.parse(jsCode, {
    ecmaVersion: 'latest',
    sourceType: 'module',
    allowReturnOutsideFunction: true,
    preserveParens: true,
    onComment: comments
})

console.log('\n=== Comments collected by Acorn ===')
comments.forEach((comment, index) => {
    console.log(`Comment #${index}:`)
    console.log(`  Type: ${comment.type}`)
    console.log(`  Value: "${comment.value}"`)
    console.log(`  Start position: ${comment.start}`)
    console.log(`  End position: ${comment.end}`)
    console.log('')
})

console.log(`Total comments collected: ${comments.length}`)