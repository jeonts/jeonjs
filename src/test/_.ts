// REPL test

const case1 = `
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

const case2 = `
function a(name) { return ("Hello, " + name) }
` //return function

const case3 = `
function a(name) { return ("Hello, " + name) }
a('world')
`
const case2_1 = `
function (name) { return ("Hello, " + name) }
` //return function

const case4 = `
let count = 0; let message = "Hello World"
`

const case5 = `
(x) => { return (x * 2); }
`

const case6 = `
((x) => { return (x * 2); })(10)
`

const case7 = `
function* countUpTo(max) {
  yield 1;
  yield 2;
  return max;
}
` //return function

const case8 = `
function* countUpTo(max) {
  yield 1;
  yield 2;
  return max;
}
countUpTo(10)
`

const case9 = `
function* countUpTo(max) {
  yield 1;
  yield 2;
  return max;
}
[...countUpTo(10)]
` //return function

const case10 = `
let element = <div className="container">
  <h1>Hello World</h1>
</div>;
` //return void

const case11 = `
<div className="container">
  <h1>Hello World</h1>
</div>;
` //return jsx

const case12 = `
let a = [1, 2, ...[3, 4], 5];
`//return void

const case13 = `
[1, 2, ...[3, 4], 5];
`

const case14 = `
{}
`//return empty object literal

const case15 = `
{a:1, b:2}
`//return object literal

const case16 = `
{
    const a = 1;
    const b = 2;
    return a + b
}
`// retunn function iife

const case17 = `
    const a = 1;
    const b = 2;
    return a + b
`// retunn function iife

const case18 = `
    const a = 1;
    const b = 2;
`// retunn void

const case19 = `
    const a = 1;
    a
`// retunn a

const case20 = `
    function (a){return a}
`// retunn function


const case21 = `
    (function (a){return a+1})(10)
`// retunn 11

const case22 = `
class Person {
  constructor(name) {
  this.name = name
};
  greet() {
  return ("Hello, " + this.name)
}
}
`//return class

const case23 = `
class Person {
  constructor(name) {
  this.name = name
};
  greet() {
  return ("Hello, " + this.name)
}
}

new Person('Alex')
`// return instance of Person

const case24 = `
class Person {
  constructor(name) {
  this.name = name
};
  greet() {
  return ("Hello, " + this.name)
}
}

new Person('Alex').greet()
`

const case25 = `
new (class Person {
  constructor(name) {
  this.name = name
};
  greet() {
  return ("Hello, " + this.name)
}
})('Ali')
`//return instance of People

const case26 = `
new (class Person {
  constructor(name) {
  this.name = name
};
  greet() {
  return ("Hello, " + this.name)
}
})('Mary).greet()
`


const case27 = `
class {
  constructor(name) {
  this.name = name
};
  greet() {
  return ("Hello, " + this.name)
}
}
`//return anonymous class

const case28 = `
new (class {
  constructor(name) {
  this.name = name
};
  greet() {
  return ("Hello, " + this.name)
}
})('Danial')
`//return intance of anonymous class

const case29 = `
new (class {
  constructor(name) {
  this.name = name
};
  greet() {
  return ("Hello, " + this.name)
}
})('John').greet()
`

const case30 = `
class Calculator {
static add(a, b){
    return a+b
}

static multiply(a, b) {
    return a*b
}
}

Calculator.add(1,4) +
Calculator.multiply(1,4)
`

const case31 = `
class Calculator {
static add(a, b){
    return a+b
}

static multiply(a, b) {
    return a*b
}
}

const {add, multiply} = Calculator

add(1,4) + multiply(1,4)
`

const case32 = `
const Calculator = {
add :(a, b)=>{
    return a+b
},
 multiply :(a, b) => {
    return a*b
}

}

const {add, multiply } = Calculator

add(1,4) + multiply (1,4)
`


const case33 = `
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


const case34 = `
function(...a) { return a }
`//return function


const case35 = `
(function(...a) { return a.length })([1, 2, 3, 4, 5])
`

const case36 = `
function a(...a) { return a.length }
a([1, 2, 3, 4, 5])
`

const case37 = `
const {a,b} = {a:1, b:3}
a+b
`
