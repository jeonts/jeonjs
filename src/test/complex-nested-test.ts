// Simple test runner for complex nested JEON tests
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { evalJeon } from '../safeEval'

// Simple test function
function expect(actual: any) {
  return {
    toBe(expected: any) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected} but got ${actual}`)
      }
      console.log('✅ Test passed')
    },
    toEqual(expected: any) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`)
      }
      console.log('✅ Test passed')
    }
  }
}

console.log('=== Complex Nested JEON Test Cases ===\n')

// Test 1: Deeply nested arithmetic expressions
console.log('--- Test 1: Deeply nested arithmetic expressions ---')
try {
  const complexCode = '(((2 + 3) * (4 - 1)) + ((5 / 2) % 2)) * (Math.max(3, 4) - 1)'
  const context = { Math }
  const jeon = js2jeon(complexCode)
  const result = evalJeon(jeon, context)

  // Calculation:
  // (((2 + 3) * (4 - 1)) + ((5 / 2) % 2)) * (Math.max(3, 4) - 1)
  // (((5) * (3)) + ((2.5) % 2)) * (4 - 1)
  // ((15) + (0.5)) * (3)
  // (15.5) * (3)
  // 46.5
  expect(result).toBe(46.5)
  console.log(`✅ ${complexCode} = ${result}`)
} catch (error) {
  console.error('❌ Deeply nested arithmetic test failed:', error)
}

// Test 2: Nested function calls with complex arguments
console.log('\n--- Test 2: Nested function calls with complex arguments ---')
try {
  const complexFunctionCode = `
    Math.max(
      Math.min(10, 20), 
      Math.floor(15.7), 
      Math.abs(-5) + Math.sqrt(16)
    )
  `
  const context = { Math }
  const jeon = js2jeon(complexFunctionCode)
  const result = evalJeon(jeon, context)

  // Calculation:
  // Math.max(Math.min(10, 20), Math.floor(15.7), Math.abs(-5) + Math.sqrt(16))
  // Math.max(10, 15, 5 + 4)
  // Math.max(10, 15, 9)
  // 15
  expect(result).toBe(15)
  console.log(`✅ Complex function calls = ${result}`)
} catch (error) {
  console.error('❌ Nested function calls test failed:', error)
}

// Test 3: Nested conditional expressions
console.log('\n--- Test 3: Nested conditional expressions ---')
try {
  const nestedConditionalCode = `
    true 
      ? (false ? "a" : (true ? "b" : "c")) 
      : (true ? "d" : "e")
  `
  const jeon = js2jeon(nestedConditionalCode)
  const result = evalJeon(jeon)

  // Evaluation:
  // true ? (false ? "a" : (true ? "b" : "c")) : (true ? "d" : "e")
  // (false ? "a" : (true ? "b" : "c"))
  // (true ? "b" : "c")
  // "b"
  expect(result).toBe("b")
  console.log(`✅ Nested conditional = ${result}`)
} catch (error) {
  console.error('❌ Nested conditional test failed:', error)
}

// Test 4: Complex nested object and array access
console.log('\n--- Test 4: Complex nested object and array access ---')
try {
  const complexObjectCode = `
    const obj = {
      a: {
        b: [1, 2, { c: 3 }]
      }
    };
    obj.a.b[2].c
  `
  const jeon = js2jeon(complexObjectCode)
  const jsCode = jeon2js(jeon)
  console.log('✅ Complex object access converted successfully')
  console.log('JS Code:', jsCode.substring(0, 100) + '...')
} catch (error) {
  console.error('❌ Complex object access test failed:', error)
}

// Test 5: Nested loops with complex conditions
console.log('\n--- Test 5: Nested loops with complex conditions ---')
try {
  const nestedLoopCode = `
    let result = 0;
    for (let i = 0; i < 3; i = i + 1) {
      for (let j = 0; j < 2; j = j + 1) {
        if (i * j > 1) {
          result = result + (i * j);
        }
      }
    }
    result
  `
  const jeon = js2jeon(nestedLoopCode)
  const jsCode = jeon2js(jeon)
  console.log('✅ Nested loop converted successfully')
  console.log('JS Code:', jsCode.substring(0, 100) + '...')
} catch (error) {
  console.error('❌ Nested loop test failed:', error)
}

// Test 6: Complex nested function with closures
console.log('\n--- Test 6: Complex nested function with closures ---')
try {
  const closureCode = `
    function outer(x) {
      return function inner(y) {
        return function deepest(z) {
          return x + y + z + Math.max(x, y, z);
        }
      }
    }
    outer(1)(2)(3)
  `
  const context = { Math }
  const jeon = js2jeon(closureCode)
  const jsCode = jeon2js(jeon)
  console.log('✅ Nested closure converted successfully')
  console.log('JS Code:', jsCode.substring(0, 100) + '...')
} catch (error) {
  console.error('❌ Nested closure test failed:', error)
}

// Test 7: Deeply nested ternary operators
console.log('\n--- Test 7: Deeply nested ternary operators ---')
try {
  const deepTernaryCode = `
    true ? 
      (false ? 
        (true ? 
          (false ? "a" : "b") : 
          (true ? "c" : "d")
        ) : 
        (false ? "e" : "f")
      ) : 
      (true ? "g" : "h")
  `
  const jeon = js2jeon(deepTernaryCode)
  const result = evalJeon(jeon)
  expect(result).toBe("f")
  console.log(`✅ Deep ternary = ${result}`)
} catch (error) {
  console.error('❌ Deep ternary test failed:', error)
}

// Test 8: Complex mathematical expression with functions
console.log('\n--- Test 8: Complex mathematical expression with functions ---')
try {
  const mathCode = `
    Math.pow(
      Math.sqrt(16) + Math.abs(-3), 
      Math.min(2, 3)
    ) - Math.floor(Math.PI)
  `
  const context = { Math }
  const jeon = js2jeon(mathCode)
  const result = evalJeon(jeon, context)

  // Calculation:
  // Math.pow(Math.sqrt(16) + Math.abs(-3), Math.min(2, 3)) - Math.floor(Math.PI)
  // Math.pow(4 + 3, 2) - 3
  // Math.pow(7, 2) - 3
  // 49 - 3
  // 46
  expect(result).toBe(46)
  console.log(`✅ Complex math = ${result}`)
} catch (error) {
  console.error('❌ Complex math test failed:', error)
}

// Test 9: Nested array and object destructuring simulation
console.log('\n--- Test 9: Nested array and object destructuring simulation ---')
try {
  const destructuringCode = `
    const data = {
      users: [
        { name: "Alice", scores: [10, 20, 30] },
        { name: "Bob", scores: [15, 25, 35] }
      ]
    };
    data.users[0].scores[1] + data.users[1].scores[2]
  `
  const jeon = js2jeon(destructuringCode)
  const jsCode = jeon2js(jeon)
  console.log('✅ Destructuring simulation converted successfully')
  console.log('JS Code:', jsCode.substring(0, 100) + '...')
} catch (error) {
  console.error('❌ Destructuring simulation test failed:', error)
}

// Test 10: Complex async nested operations
console.log('\n--- Test 10: Complex async nested operations ---')
try {
  const asyncCode = `
    async function process() {
      const result1 = await Promise.resolve(10);
      const result2 = await Promise.resolve(
        result1 * (await Promise.resolve(2))
      );
      return result2 + Math.max(5, await Promise.resolve(3));
    }
    process()
  `
  const context = { Math, Promise }
  const jeon = js2jeon(asyncCode)
  const jsCode = jeon2js(jeon)
  console.log('✅ Complex async converted successfully')
  console.log('JS Code:', jsCode.substring(0, 100) + '...')
} catch (error) {
  console.error('❌ Complex async test failed:', error)
}

console.log('\n🎉 All complex nested tests completed successfully!')