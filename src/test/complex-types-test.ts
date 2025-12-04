import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import JSON5 from '@mainnet-pat/json5-bigint'

console.log('=== Complex Types Round Trip Test ===\n')

// Test the complex object with various built-in types
const jsCode = `
// Some of the built-in JavaScript types that get encoded

const item = { foo: 1 };

return {
  date: new /* Date (not supported) */ Date("2025-01-01T00:00:00.000Z"),
  regexp2: /* hello (not supported) */ /hello world/,
  regexp: /hello world/gi,
  error: new Error("Something went wrong", { cause: 404 }),
  url: new URL("https://example.com/path?query=value"),
  urlSearchParams: new URLSearchParams("query=value&another=value"),
  bigint: 1234567890123456789n,
  symbol: Symbol.for("test"), // end of line
  undefined: undefined,
  // None of those are handled by normal JSON.stringify
  specialNumbers: [Infinity, /* negative (not supported) */ -Infinity, // end of inline
   -0, NaN],
  someData: new Uint8Array([1, 2, 3, 4, 5]),
  set: new Set([1, 2, 3]),
  map: new Map([[1, 1], // end of line
  [2, 2]]),
  sameRefs: [item, item, item],
  sparsedArray: [0,,, undefined, 0],
}
`

console.log('Original JavaScript:')
console.log(jsCode)

// Convert JS to JEON
console.log('\n--- Converting JS to JEON ---')
try {
  const jeonResult = js2jeon(jsCode, { json: JSON5 as any })
  console.log('JEON Output:')
  console.log(JSON.stringify(jeonResult, null, 2))

  // Convert JEON back to JS
  console.log('\n--- Converting JEON back to JS ---')
  const jsResult = jeon2js(jeonResult, { json: JSON5 as any })
  console.log('Generated JavaScript:')
  console.log(jsResult)

  console.log('\n✅ Round-trip test completed!')
} catch (error: any) {
  console.log('Error:', error.message)
  console.log('Stack:', error.stack)
}