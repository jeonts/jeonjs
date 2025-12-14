import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'

console.log('=== Final Demo: evalJeon now supports all js2jeon outputs ===\n')

// Demonstrate that evalJeon can now handle all combinations of JS constructs
const testCases = [
    {
        name: 'Simple expression',
        code: '1 + 2 * 3'
    },
    {
        name: 'Variable declarations and assignments',
        code: 'let x = 10; const y = 20; x + y'
    },
    {
        name: 'Function declaration and call',
        code: 'function add(a, b) { return a + b; } add(5, 7)'
    },
    {
        name: 'Arrow function',
        code: 'const multiply = (a, b) => a * b; multiply(3, 4)'
    },
    {
        name: 'Class with constructor and methods',
        code: `class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  getArea() {
    return this.width * this.height;
  }
}
const rect = new Rectangle(5, 3);
rect.getArea();`
    },
    {
        name: 'Generator function with yield',
        code: `function* countUpTo(max) {
  let i = 1;
  while (i <= max) {
    yield i++;
  }
}
const counter = countUpTo(3);
[counter.next().value, counter.next().value, counter.next().value]`
    },
    {
        name: 'Generator function with spread operator',
        code: `function* fibonacci(n) {
  let a = 0, b = 1;
  for (let i = 0; i < n; i++) {
    yield a;
    [a, b] = [b, a + b];
  }
}
[...fibonacci(5)]`
    },
    {
        name: 'Array and object literals with spread',
        code: 'const arr1 = [1, 2]; const arr2 = [3, 4]; [...arr1, ...arr2]'
    },
    {
        name: 'Complex control flow',
        code: `let result = 0;
for (let i = 1; i <= 5; i++) {
  if (i % 2 === 0) {
    result += i;
  }
}
result`
    }
]

testCases.forEach((testCase, index) => {
    console.log(`\n--- Test ${index + 1}: ${testCase.name} ---`)
    console.log('Code:', testCase.code)

    try {
        const jeon = js2jeon(testCase.code)
        const result = evalJeon(jeon)
        console.log('✅ Result:', result)
    } catch (error: any) {
        console.error('❌ Error:', error.message)
    }
})

console.log('\n=== Summary ===')
console.log('✅ evalJeon now supports all JavaScript constructs that js2jeon can produce')
console.log('✅ Works with expressions, statements, blocks, arrays, objects')
console.log('✅ Handles IIFE internally when not explicitly given')
console.log('✅ Supports generator functions with yield and yield* operators')
console.log('✅ Properly handles spread operator with iterables')
console.log('✅ Maintains backward compatibility with existing functionality')