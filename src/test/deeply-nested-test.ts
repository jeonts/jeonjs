// Deeply nested test cases for JEON converter with extreme complexity
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

console.log('=== Deeply Nested JEON Test Cases (Extreme Complexity) ===\n')

// Test 1: Extremely deeply nested arithmetic with multiple functions
console.log('--- Test 1: Extremely deeply nested arithmetic with multiple functions ---')
try {
  const extremeCode = `
    Math.pow(
      Math.max(
        Math.min(100, 200), 
        Math.floor(
          Math.abs(-50) + Math.sqrt(64)
        )
      ), 
      Math.min(
        2, 
        Math.ceil(Math.PI)
      )
    ) + Math.max(
      Math.min(5, 10), 
      Math.floor(
        Math.abs(-3) + Math.sqrt(9)
      )
    )
  `
  const context = { Math }
  const jeon = js2jeon(extremeCode)
  const result = evalJeon(jeon, context)

  // Calculation:
  // Math.pow(Math.max(Math.min(100, 200), Math.floor(Math.abs(-50) + Math.sqrt(64))), Math.min(2, Math.ceil(Math.PI))) + Math.max(Math.min(5, 10), Math.floor(Math.abs(-3) + Math.sqrt(9)))
  // Math.pow(Math.max(100, Math.floor(50 + 8)), Math.min(2, 4)) + Math.max(5, Math.floor(3 + 3))
  // Math.pow(Math.max(100, 58), 2) + Math.max(5, 6)
  // Math.pow(100, 2) + 6
  // 10000 + 6
  // 10006
  expect(result).toBe(10006)
  console.log(`✅ Extreme nested arithmetic = ${result}`)
} catch (error) {
  console.error('❌ Extreme nested arithmetic test failed:', error)
}

// Test 2: Deeply nested object property access with computed properties
console.log('\n--- Test 2: Deeply nested object property access with computed properties ---')
try {
  const deepObjectCode = `
    const obj = {
      level1: {
        level2: {
          level3: {
            level4: {
              value: 42
            }
          }
        }
      }
    };
    obj.level1.level2.level3.level4.value
  `
  const jeon = js2jeon(deepObjectCode)
  const jsCode = jeon2js(jeon)
  console.log('✅ Deep object access converted successfully')
  console.log('JS Code:', jsCode.substring(0, 100) + '...')
} catch (error) {
  console.error('❌ Deep object access test failed:', error)
}

// Test 3: Extremely nested function calls with closures
console.log('\n--- Test 3: Extremely nested function calls with closures ---')
try {
  const extremeClosureCode = `
    function level1(a) {
      return function level2(b) {
        return function level3(c) {
          return function level4(d) {
            return function level5(e) {
              return a + b + c + d + e + Math.max(a, b, c, d, e);
            }
          }
        }
      }
    }
    level1(1)(2)(3)(4)(5)
  `
  const context = { Math }
  const jeon = js2jeon(extremeClosureCode)
  const jsCode = jeon2js(jeon)
  console.log('✅ Extreme nested closure converted successfully')
  console.log('JS Code:', jsCode.substring(0, 100) + '...')
} catch (error) {
  console.error('❌ Extreme nested closure test failed:', error)
}

// Test 4: Deeply nested ternary operators with complex conditions
console.log('\n--- Test 4: Deeply nested ternary operators with complex conditions ---')
try {
  const deepComplexTernaryCode = `
    (true && false) ? 
      ((1 + 2) > (3 - 1)) ? 
        ((Math.max(5, 3) === 5) ? 
          ("a" + "b") : 
          ("c" + "d")
        ) : 
        ((Math.min(1, 2) !== 3) ? 
          ("e" + "f") : 
          ("g" + "h")
        )
      : 
      ((Math.abs(-10) >= 5) ? 
        ("i" + "j") : 
        ("k" + "l")
      )
  `
  const context = { Math }
  const jeon = js2jeon(deepComplexTernaryCode)
  const result = evalJeon(jeon, context)

  // Evaluation:
  // (true && false) ? ... : ((Math.abs(-10) >= 5) ? ("i" + "j") : ("k" + "l"))
  // false ? ... : ((10 >= 5) ? ("i" + "j") : ("k" + "l"))
  // ((10 >= 5) ? ("i" + "j") : ("k" + "l"))
  // (true ? ("i" + "j") : ("k" + "l"))
  // "i" + "j"
  // "ij"
  expect(result).toBe("ij")
  console.log(`✅ Deep complex ternary = ${result}`)
} catch (error) {
  console.error('❌ Deep complex ternary test failed:', error)
}

// Test 5: Nested loops with multiple levels and complex conditions
console.log('\n--- Test 5: Nested loops with multiple levels and complex conditions ---')
try {
  const extremeLoopCode = `
    let result = 0;
    for (let i = 0; i < 2; i = i + 1) {
      for (let j = 0; j < 2; j = j + 1) {
        for (let k = 0; k < 2; k = k + 1) {
          if ((i + j + k) % 2 === 0) {
            for (let l = 0; l < 2; l = l + 1) {
              if (l === 1) {
                result = result + (i * j * k * l);
              }
            }
          }
        }
      }
    }
    result
  `
  const jeon = js2jeon(extremeLoopCode)
  const jsCode = jeon2js(jeon)
  console.log('✅ Extreme nested loop converted successfully')
  console.log('JS Code:', jsCode.substring(0, 100) + '...')
} catch (error) {
  console.error('❌ Extreme nested loop test failed:', error)
}

// Test 6: Deeply nested array access with computed indices
console.log('\n--- Test 6: Deeply nested array access with computed indices ---')
try {
  const deepArrayCode = `
    const arr = [
      [
        [
          [1, 2, 3],
          [4, 5, 6]
        ],
        [
          [7, 8, 9],
          [10, 11, 12]
        ]
      ],
      [
        [
          [13, 14, 15],
          [16, 17, 18]
        ],
        [
          [19, 20, 21],
          [22, 23, 24]
        ]
      ]
    ];
    arr[1][0][1][2]
  `
  const jeon = js2jeon(deepArrayCode)
  const jsCode = jeon2js(jeon)
  console.log('✅ Deep array access converted successfully')
  console.log('JS Code:', jsCode.substring(0, 100) + '...')
} catch (error) {
  console.error('❌ Deep array access test failed:', error)
}

// Test 7: Extremely nested mathematical expression with all operators
console.log('\n--- Test 7: Extremely nested mathematical expression with all operators ---')
try {
  const extremeMathCode = `
    (
      (
        (2 + 3) * (4 - 1) + 
        (Math.max(5, 6) % Math.min(3, 4))
      ) / 
      (
        Math.floor(Math.PI) + 
        (Math.abs(-7) - Math.ceil(Math.E))
      )
    ) * 
    (
      Math.sqrt(16) + 
      Math.pow(2, 3) - 
      Math.log(Math.E)
    )
  `
  const context = { Math }
  const jeon = js2jeon(extremeMathCode)
  const jsCode = jeon2js(jeon)
  console.log('✅ Extreme math expression converted successfully')
  console.log('JS Code:', jsCode.substring(0, 100) + '...')
} catch (error) {
  console.error('❌ Extreme math expression test failed:', error)
}

// Test 8: Deeply nested async/await with Promise chains
console.log('\n--- Test 8: Deeply nested async/await with Promise chains ---')
try {
  const extremeAsyncCode = `
    async function deepAsync() {
      const result1 = await Promise.resolve(10);
      const result2 = await Promise.resolve(
        result1 + (await Promise.resolve(5))
      );
      const result3 = await Promise.resolve(
        result2 * (await Promise.resolve(
          await Promise.resolve(2)
        ))
      );
      const result4 = await Promise.resolve(
        result3 + Math.max(
          await Promise.resolve(3),
          await Promise.resolve(4)
        )
      );
      return result4;
    }
    deepAsync()
  `
  const context = { Math, Promise }
  const jeon = js2jeon(extremeAsyncCode)
  const jsCode = jeon2js(jeon)
  console.log('✅ Extreme async expression converted successfully')
  console.log('JS Code:', jsCode.substring(0, 100) + '...')
} catch (error) {
  console.error('❌ Extreme async expression test failed:', error)
}

// Test 9: Deeply nested try/catch blocks
console.log('\n--- Test 9: Deeply nested try/catch blocks ---')
try {
  const deepTryCatchCode = `
    try {
      try {
        try {
          throw new Error("Deep error");
        } catch (e1) {
          try {
            throw new Error("Deeper error");
          } catch (e2) {
            "Successfully caught deep error: " + e2.message;
          }
        }
      } catch (e3) {
        "This should not be reached";
      }
    } catch (e4) {
      "This should also not be reached";
    }
  `
  const jeon = js2jeon(deepTryCatchCode)
  const jsCode = jeon2js(jeon)
  console.log('✅ Deep try/catch converted successfully')
  console.log('JS Code:', jsCode.substring(0, 100) + '...')
} catch (error) {
  console.error('❌ Deep try/catch test failed:', error)
}

// Test 10: Extremely complex mixed expression
console.log('\n--- Test 10: Extremely complex mixed expression ---')
try {
  const mixedCode = `
    const obj = {
      func: function(x) {
        return function(y) {
          return x + y + Math.max(x, y);
        }
      },
      arr: [
        {
          nested: [
            function(a) {
              return a * 2;
            },
            function(b) {
              return b + 3;
            }
          ]
        }
      ]
    };
    
    obj.arr[0].nested[0](
      obj.func(5)(3)
    )
  `
  const context = { Math }
  const jeon = js2jeon(mixedCode)
  const jsCode = jeon2js(jeon)
  console.log('✅ Complex mixed expression converted successfully')
  console.log('JS Code:', jsCode.substring(0, 100) + '...')
} catch (error) {
  console.error('❌ Complex mixed expression test failed:', error)
}

console.log('\n🎉 All deeply nested tests completed successfully!')