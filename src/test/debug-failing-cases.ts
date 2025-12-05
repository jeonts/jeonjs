import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Debug Failing Cases ===\n')

// Test some of the failing cases to understand the issues

// Case 14: Empty object
console.log('--- Testing case14: {} ---')
try {
  const code14 = '{}'
  console.log('Code:', code14)
  const jeon14 = js2jeon(code14, { iife: true })
  console.log('JEON:', JSON.stringify(jeon14, null, 2))
  const result14 = evalJeon(jeon14)
  console.log('Result:', result14)
  console.log('✅ Success\n')
} catch (error: any) {
  console.error('❌ Error:', error.message)
  console.log('')
}

// Case 1: Complex object with built-in types
console.log('--- Testing case1: Complex object ---')
try {
  const code1 = `
const item = { foo: 1 };
return {
  date: new Date("2025-01-01T00:00:00.000Z"),
  regexp: /hello world/gi,
  error: new Error("Something went wrong"),
  url: new URL("https://example.com/path?query=value"),
  bigint: 1234567890123456789n,
  symbol: Symbol.for("test"),
  undefined: undefined,
  specialNumbers: [Infinity, -Infinity, -0, NaN],
  someData: new Uint8Array([1, 2, 3, 4, 5]),
  set: new Set([1, 2, 3]),
  map: new Map([[1, 1], [2, 2]]),
  sameRefs: [item, item, item],
  sparsedArray: [0,,, undefined, 0],
}
`
  console.log('Code:')
  console.log(code1)
  const jeon1 = js2jeon(code1, { iife: true })
  console.log('JEON:')
  console.log(JSON.stringify(jeon1, null, 2))
  const result1 = evalJeon(jeon1)
  console.log('Result:')
  console.log(result1)
  console.log('✅ Success\n')
} catch (error: any) {
  console.error('❌ Error:', error.message)
  console.log('')
}

// Case 33: Object with getter
console.log('--- Testing case33: Object with getter ---')
try {
  const code33 = `
const Calculator = {
  add: (a, b) => {
    return a + b;
  },
  multiply: (a, b) => {
    return a * b;
  },
  get name() {
    return 'Cal';
  }
};

const { add, multiply, name } = Calculator;

add(1, 4) + multiply(1, 4) + ' ' + name
`
  console.log('Code:')
  console.log(code33)
  const jeon33 = js2jeon(code33, { iife: true })
  console.log('JEON:')
  console.log(JSON.stringify(jeon33, null, 2))
  const result33 = evalJeon(jeon33)
  console.log('Result:')
  console.log(result33)
  console.log('✅ Success\n')
} catch (error: any) {
  console.error('❌ Error:', error.message)
  console.log('')
}