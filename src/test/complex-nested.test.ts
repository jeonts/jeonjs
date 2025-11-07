// Complex nested test cases for JEON converter
import { expect, test } from '@woby/chk'
import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'
import { evalJeon } from '../safeEval'

test('Deeply nested arithmetic expressions', () => {
    // Complex nested arithmetic with multiple levels of parentheses
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
})

test('Nested function calls with complex arguments', () => {
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
})

test('Nested conditional expressions', () => {
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
})

test('Complex nested object and array access', () => {
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
    console.log('Complex object access JS:', jsCode)
    // Note: Full evaluation would require defining the object in context
})

test('Nested loops with complex conditions', () => {
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
    console.log('Nested loop JS:', jsCode)
})

test('Complex nested function with closures', () => {
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
    console.log('Nested closure JS:', jsCode)
})

test('Deeply nested ternary operators', () => {
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
    expect(result).toBe("c")
})

test('Complex mathematical expression with functions', () => {
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
})

test('Nested array and object destructuring simulation', () => {
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
    console.log('Destructuring simulation JS:', jsCode)
})

test('Complex async nested operations', () => {
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
    console.log('Complex async JS:', jsCode)
})

console.log('🎉 All complex nested tests completed!')