# JEON Specification

The JEON Notation (JEON) is a method for representing executable JavaScript constructs—such as operations, functions, and components—using only standard JSON objects, arrays, and literals. This enables easy serialization and transport of executable logic.

Every valid JEON structure is a single JSON Object or Array where the key defines the operation, and the value supplies the necessary operands or body.

## Core Concepts

| Concept | Representation | Purpose |
|---------|----------------|---------|
| Expression | Object or Array | The fundamental unit of computation. |
| Reference | String prefixed with @ | Used to refer to defined variables or function parameters (e.g., `@name`, `@value`). For member access, use the explicit `.` operator. |
| Instance Reference | `@this` | Refers to the current object instance within a method or accessor. |
| Literal | String, Number, Boolean, null | Standard JSON values treated as constants. |

## Complete Operator Reference

This section provides a comprehensive reference for all operators supported in JEON, including their syntax, usage examples, and JavaScript equivalents.

### Arithmetic Operators

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `+` | `{"+": [operand1, operand2, ...]}` | Array of 2+ operands | `a + b + c` | `{"+": [1, 2, 3]}` |
| `-` | `{"-": [operand1, operand2, ...]}` | Array of 2+ operands | `a - b - c` | `{"-": [10, 3, 2]}` |
| `*` | `{"*": [operand1, operand2, ...]}` | Array of 2+ operands | `a * b * c` | `{"*": [2, 3, 4]}` |
| `/` | `{"/": [operand1, operand2, ...]}` | Array of 2+ operands | `a / b / c` | `{"/": [24, 2, 3]}` |
| `%` | `{"%": [operand1, operand2]}` | Array of 2 operands | `a % b` | `{"%": [10, 3]}` |
| Unary `+` | `{"+": operand}` | Single operand | `+a` | `{"+": "@value"}` |
| Unary `-` | `{"-": operand}` | Single operand | `-a` | `{"-": "@value"}` |

### Comparison Operators

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `==` | `{"==": [operand1, operand2]}` | Array of 2 operands | `a == b` | `{"==": ["@a", "@b"]}` |
| `===` | `{"===": [operand1, operand2]}` | Array of 2 operands | `a === b` | `{"===": ["@a", "@b"]}` |
| `!=` | `{"!=": [operand1, operand2]}` | Array of 2 operands | `a != b` | `{"!=": ["@a", "@b"]}` |
| `!==` | `{"!==": [operand1, operand2]}` | Array of 2 operands | `a !== b` | `{"!==": ["@a", "@b"]}` |
| `<` | `{"<": [operand1, operand2]}` | Array of 2 operands | `a < b` | `{"<": ["@a", "@b"]}` |
| `>` | `{">": [operand1, operand2]}` | Array of 2 operands | `a > b` | `{">": ["@a", "@b"]}` |
| `<=` | `{"<=": [operand1, operand2]}` | Array of 2 operands | `a <= b` | `{"<=": ["@a", "@b"]}` |
| `>=` | `{">=": [operand1, operand2]}` | Array of 2 operands | `a >= b` | `{">=": ["@a", "@b"]}` |
| `instanceof` | `{"instanceof": [operand1, operand2]}` | Array of 2 operands | `a instanceof b` | `{"instanceof": ["@obj", "@Array"]}` |

### Logical Operators

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `&&` | `{"&&": [operand1, operand2, ...]}` | Array of 2+ operands | `a && b && c` | `{"&&": ["@a", "@b", "@c"]}` |
| `||` | `{"||": [operand1, operand2, ...]}` | Array of 2+ operands | `a || b || c` | `{"||": ["@a", "@b", "@c"]}` |
| `!` | `{"!": operand}` | Single operand | `!a` | `{"!": "@condition"}` |

### Bitwise Operators

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `~` | `{"~": operand}` | Single operand | `~a` | `{"~": "@value"}` |
| `&` | `{"&": [operand1, operand2]}` | Array of 2 operands | `a & b` | `{"&": [5, 3]}` |
| `|` | `{"|": [operand1, operand2]}` | Array of 2 operands | `a | b` | `{"|": [5, 3]}` |
| `^` | `{"^": [operand1, operand2]}` | Array of 2 operands | `a ^ b` | `{"^": [5, 3]}` |

### Bitwise Shift Operators

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `<<` | `{"<<": [operand1, operand2]}` | Array of 2 operands | `a << b` | `{"<<": [5, 2]}` |
| `>>` | `{">>": [operand1, operand2]}` | Array of 2 operands | `a >> b` | `{">>": [5, 2]}` |
| `>>>` | `{">>>": [operand1, operand2]}` | Array of 2 operands | `a >>> b` | `{">>>": [5, 2]}` |

### Assignment Operators

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `=` | `{"=": [target, value]}` | Array of 2 operands | `a = b` | `{"=": ["@a", 5]}` |
| `+=` | `{"+=": [target, value]}` | Array of 2 operands | `a += b` | `{"+=": ["@a", 5]}` |
| `-=` | `{"-=": [target, value]}` | Array of 2 operands | `a -= b` | `{"-=": ["@a", 5]}` |
| `*=` | `{"*=": [target, value]}` | Array of 2 operands | `a *= b` | `{"*=": ["@a", 5]}` |
| `/=` | `{"/=": [target, value]}` | Array of 2 operands | `a /= b` | `{"/=": ["@a", 5]}` |
| `%=` | `{"%=": [target, value]}` | Array of 2 operands | `a %= b` | `{"%=": ["@a", 5]}` |
| `<<=` | `{"<<=": [target, value]}` | Array of 2 operands | `a <<= b` | `{"<<=": ["@a", 2]}` |
| `>>=` | `{">>=": [target, value]}` | Array of 2 operands | `a >>= b` | `{">>=": ["@a", 2]}` |
| `>>>=` | `{">>>=": [target, value]}` | Array of 2 operands | `a >>>= b` | `{">>>=": ["@a", 2]}` |
| `&=` | `{"&=": [target, value]}` | Array of 2 operands | `a &= b` | `{"&=": ["@a", 3]}` |
| `^=` | `{"^=": [target, value]}` | Array of 2 operands | `a ^= b` | `{"^=": ["@a", 3]}` |
| `|=` | `{"|=": [target, value]}` | Array of 2 operands | `a |= b` | `{"|=": ["@a", 3]}` |

### Increment/Decrement Operators

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `++` | `{"++": operand}` | Single operand | `++a` | `{"++": "@counter"}` |
| `--` | `{"--": operand}` | Single operand | `--a` | `{"--": "@counter"}` |
| `++.` | `{"++.": operand}` | Single operand | `a++` | `{"++.": "@counter"}` |
| `--.` | `{"--.": operand}` | Single operand | `a--` | `{"--.": "@counter"}` |

### Special Operators

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `()` | `{"()": [function, arg1, arg2, ...]}` | Array with function reference and arguments | `func(a, b)` | `{"()": ["@func", "@a", "@b"]}` |
| `.` | `{"." [object, property1, property2, ...]}` | Array with object and property chain | `obj.prop1.prop2` | `{"." ["@obj", "prop1", "prop2"]}` |
| `new` | `{"new": [constructor, arg1, arg2, ...]}` | Array with constructor and arguments | `new Class(a, b)` | `{"new": ["Date", 0]}` |
| `?` | `{"?": [condition, trueValue, falseValue]}` | Array of 3 operands | `condition ? trueValue : falseValue` | `{"?": ["@isValid", "valid", "invalid"]}` |
| `typeof` | `{"typeof": operand}` | Single operand | `typeof a` | `{"typeof": "@value"}` |
| `void` | `{"void": operand}` | Single operand | `void a` | `{"void": "@value"}` |
| `delete` | `{"delete": operand}` | Single operand | `delete a` | `{"delete": "@value"}` |
| `(` | `{"(": expression}` | Single operand | `(expression)` | `{"(": {"+": [1, 2]}}` |
| `...` | `{"...": expression}` | Single operand | `...expression` | `{"...": [1, 2, 3]}` |
| `class` | `{"class ClassName": { ... }}` | Object (Class Configuration) | `class ClassName { ... }` | `{"class Person": { ... }}` |
| `extends` | Used within class definition | Parent class reference | `class Child extends Parent` | Used within class definition |
| `static` | Used within class definition | Static property/method value | `static propertyName` | Used within class definition |

### Control Flow Operators

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `if` | `{"if": [condition, trueBlock, falseBlock]}` | Array of 2-3 operands | `if (condition) { trueBlock } else { falseBlock }` | `{"if": ["@condition", "doThis()", "doThat()"]}` |
| `while` | `{"while": [condition, body]}` | Array of 2 operands | `while (condition) { body }` | `{"while": ["@condition", "doThis()"]}` |
| `for` | `{"for": [init, condition, increment, body]}` | Array of 4 operands | `for (init; condition; increment) { body }` | `{"for": ["@i = 0", "@i < 10", "@i++", "doThis()"]}` |
| `do` | `{"do": [body, condition]}` | Array of 2 operands | `do { body } while (condition)` | `{"do": ["doThis()", "@condition"]}` |
| `break` | `{"break": label}` | Optional string | `break label` | `{"break": "loop1"}` |
| `continue` | `{"continue": label}` | Optional string | `continue label` | `{"continue": "loop1"}` |
| `switch` | `{"switch": [expression, cases, default]}` | Array of 3 operands | `switch (expression) { cases }` | Complex structure |

### Function Declaration Operators

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `function` | `{"function(param1, param2, ...)": [body]}` | Array of statements | `function name(param1, param2) { body }` | `{"function(a, b)": [{"return": {"+": ["@a", "@b"]}}]}` |
| `async function` | `{"async function(param1, param2, ...)": [body]}` | Array of statements | `async function name(param1, param2) { body }` | `{"async function()": [{"await": {"fetch()": ["/api"]}}]}` |
| `function*` | `{"function*(param1, param2, ...)": [body]}` | Array of statements | `function* name(param1, param2) { body }` | `{"function*()": [{"yield": 1}]}` |
| `=>` | `{"(param1, param2, ...) =>": body}` | Expression or array of statements | `(param1, param2) => body` | `{"(a, b) =>": {"+": ["@a", "@b"]}}` |

### Other Operators

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `return` | `{"return": expression}` | Single operand | `return expression` | `{"return": "@value"}` |
| `yield` | `{"yield": expression}` | Single operand | `yield expression` | `{"yield": "@value"}` |
| `yield*` | `{"yield*": expression}` | Single operand | `yield* expression` | `{"yield*": [1, 2, 3]}` |
| `await` | `{"await": expression}` | Single operand | `await expression` | `{"await": {"fetch()": ["/api"]}}` |
| `break` | `{"break": label}` | Optional string | `break label` | `{"break": "loop1"}` |
| `continue` | `{"continue": label}` | Optional string | `continue label` | `{"continue": "loop1"}` |

## Variable Declaration Operators

JEON uses special operators for variable declarations:

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `@` | `{"@": { variableName: initialValue }}` | Object (Name/Value map) | `let variableName = initialValue` | `{"@": { "x": 5 }}` |
| `@@` | `{"@@": { constantName: initialValue }}` | Object (Name/Value map) | `const constantName = initialValue` | `{"@@": { "PI": 3.14159 }}` |

## Instance References

JEON provides special references for accessing instance properties:

| Reference | JEON Structure | JavaScript Equivalent | Example |
|----------|----------------|----------------------|---------|
| `@this` | Special reference | `this` | `{"@this"}` |
| `@super` | Special reference | `super` | `{"@super"}` |
| `@void` | Special reference | `void` | `{"@void"}` |
| `@undefined` | Special reference | `undefined` | `{"@undefined"}` |

## JSON5 Support

While the JEON specification is based on standard JSON, the library also supports **JSON5**. This allows for a more human-readable and less verbose representation of JEON objects.

JSON5 features that can be used with JEON include:
- Unquoted object keys.
- Single-quoted strings.
- Trailing commas in objects and arrays.
- Comments.

To use JSON5, you can pass a JSON5 parser to the `js2jeon` and `jeon2js` functions in the `options` object:

``typescript
import { js2jeon, jeon2js } from 'jeon';
import JSON5 from 'json5';

const code = 'const a = { key: "value" }';

// Convert to JEON using JSON5
const jeon = js2jeon(code, { json: JSON5 });

// Convert back to JavaScript using JSON5
const js = jeon2js(jeon, { json: JSON5 });
```

## 1. Function and Operator Expressions

These structures use the operation as the key and its operands as the value (typically an array of expressions or references).

### A. Infix Operators

Standard binary and specialized operators are represented by the operator symbol as the key, with an array of operands as the value.

| JS Construct | Key/Structure | Value | Example (JS: a + b) |
|--------------|---------------|-------|---------------------|
| op1 <lhs> <rhs> | `{"<op>": [lhs, rhs]}` | Array of operands | `{"*": ["@price", "@quantity"]}` |
| Ternary Operator | c ? t : f | `{"?": [c, t, f]}` | `{"?": ["@is_valid", 1, 0]}` |
| Conditional Execution | if (c) { t } | `{"if": [c, t]}` | `{"if": ["@a", {"alertMessage()": ["error"]}]}` |
| Logical AND | a && b | `{"&&": [a, b]}` | `{"&&": ["@can_edit", "@is_admin"]}` |

### B. Function Declarations

The value is the expression or execution block that the function will execute and return.

| JS Construct | Key/Structure | Value | @this Binding | Explanation |
|--------------|---------------|-------|---------------|-------------|
| Arrow Function | `(p) => {body}` | `{"($p1, $p2, ...) =>": {body}}` | Lexical (fixed at definition) | Concise, expression-based function. Use `()=>` for zero arguments. |
| Traditional Function | `function(p) {body}` | `{"function($p1, $p2, ...)": {body}}` | Dynamic (set by caller) | Traditional function definition, ideal for dynamic methods. Use `function()` for zero arguments. |
| Generator Function | `function*(p) {body}` | `{"function*($p1, $p2, ...)": {body}}` | Dynamic (set by caller) | Generator function that can yield values. Use `function*()` for zero arguments. |
| Async Function | `async function(p) {body}` | `{"async function($p1, $p2, ...)": {body}}` | Dynamic (set by caller) | Asynchronous function that can use await. Use `async function()` for zero arguments. |

#### JEON Examples (Traditional Function):

**JS: `function sum(a, b) { return a + b; }`**

```json
{
  "function(a, b)": [
    { "return": { "+": ["@a", "@b"] } }
  ]
}
```

**JS: `function getX() { return this.x; }`**

```json
{
  "function()": [
    { "return": { ".": ["@this", "x"] } }
  ]
}
```

#### JEON Examples (Generator Function):

**JS: `function* countUpTo(max) { yield 1; yield 2; return max; }`**

```json
{
  "function* countUpTo(max)": [
    { "yield": 1 },
    { "yield": 2 },
    { "return": "@max" }
  ]
}
```

#### JEON Examples (Async Function):

**JS: `async function fetchData() { const response = await fetch('/api/data'); return response; }`**

```json
{
  "async function fetchData()": [
    {
      "@": {
        "response": {
          "await": {
            "fetch()": ["/api/data"]
          }
        }
      }
    },
    {
      "return": "@response"
    }
  ]
}
```

#### JEON Examples (Arrow Function):

1. Simple Literal Return:

```json
{
  "()=>": 23
}
```

2. Complex Object Return (JS: `() => ({ name: 'aa', age: new Date().getFullYear() - 2000 })`):

```json
{
  "()=>": {
    "name": "aa",
    "age": {
      "-": [
       {
          "()": [
            { ".": [{ "new": ["Date"] }, "getFullYear"] }
          ]
        },
        2000
      ]
    }
  }
}
```

### C. Function Execution (Invocation)

The concise `()` operator is used to execute a function. The first element is the function reference, followed by arguments.

Structure: `{"()": [function_expression, arg1, arg2, ...]}`

- `function_expression`: An expression that resolves to a function object (often using the `.` operator for member access, or `@` for variable reference).
- `arg1, arg2, ...`: The arguments passed to the function.

**Important**: Shorthand function call syntax like `"functionName()"` is **NOT supported** for security and determinism. Always use the explicit `()` operator with proper function references.

| Type | JS Construct | JEON Structure | Explanation |
|------|--------------|----------------|-------------|
| Method Call | `x.list.pop()` | `{"()": [{".": ["@x", "list", "pop"]}]}` | Calls the pop method on x.list |
| Method on Dynamic Result | `(new Date()).getFullYear()` | `{"()": [{".": [{ "new": ["Date"] }, "getFullYear"]}]}` | Calls getFullYear on a new Date instance |
| Static Method Call | `Math.sin(val)` | `{"()": [{".": ["@Math", "sin"]}, "@val"]}` | Calls Math.sin with val |
| Function Variable | `f(arg)` | `{"()": ["@f", "@arg"]}` | Calls function stored in variable f |

#### JEON Example (Invoking a function found via a chain):

``json
{
  "()": [
    { ".": ["@Math", "floor"] }, 
    { "()": [{".": ["@app", "getState"]}] }
  ]
}
```

### D. Constructor Call / New Operator

The new operator is used to instantiate a class or constructor function. The value is an array where the first element is the class name (as a string) and subsequent elements are constructor arguments.

| JS Construct | Key/Structure | Value | Example (JS: new Date(0)) |
|--------------|---------------|-------|---------------------------|
| `new Class(args)` | `{"new": [Class, args]}` | Array | |

#### JEON Example:

```json
{
  "new": ["Date", 0]
}
```

### E. Member Access and Retrieval (Property Chaining)

JEON supports two operators for member access: the `.` operator for dot notation and property chaining, and the `[]` operator for bracket notation and indexed access.

#### 1. Dot Notation (`.` operator)

The `.` operator is used for retrieving nested property values or function objects using dot notation (`.`member).

Structure: `{".": [target_expression, segment1, segment2, ...]}`

- `target_expression`: The starting object instance (e.g., `@x`, `{"new": [...]}`).
- `segmentN`: Literal property names as strings. These are not prefixed with `@` since they represent literal property names, not variable references.

| Type | JS Construct | JEON Structure | Explanation |
|------|--------------|----------------|-------------|
| Dot Access Chain | `x.list.pop` | `{".": ["@x", "list", "pop"]}` | Retrieves the pop function object from the array at `x.list`. Property names are literal strings. |
| Mixed Access | `x[1].data` | `{".": ["@x", 1, "data"]}` | Retrieves the data property from the object at `x[1]`. |

#### 2. Bracket Notation (`[]` operator)

The `[]` operator is used for bracket notation access (`[key]`) and supports both literal keys and variable references.

Structure: `{"[]": [target_expression, key_expression]}`

- `target_expression`: The object instance to access (e.g., `@x`, `{"new": [...]}`).
- `key_expression`: The key to access. This can be:
  - A literal string/number (e.g., `"propertyName"`, `1`)
  - A variable reference prefixed with `@` (e.g., `@variableName`)
  - An expression that evaluates to a key (e.g., `{"+": ["@a", "@b"]}`)

| Type | JS Construct | JEON Structure | Explanation |
|------|--------------|----------------|-------------|
| Literal Key Access | `x["property"]` | `{"[]": ["@x", "property"]}` | Retrieves the value using a literal string key. |
| Variable Reference | `x[variable]` | `{"[]": ["@x", "@variable"]}` | Retrieves the value using the value of `variable` as the key. |
| Computed Key | `x[a + b]` | `{"[]": ["@x", {"+": ["@a", "@b"]}]}` | Retrieves the value using the result of `a + b` as the key. |
| Nested Bracket Access | `x[list][pop]` | `{"[]": [{"[]": ["@x", "@list"]}, "@pop"]}` | Retrieves the value through nested bracket access with variable references. |
| Nested Literal Bracket | `x["list"]["pop"]` | `{"[]": [{"[]": ["@x", "list"]}, "pop"]}` | Retrieves the value through nested bracket access with literal strings. |

#### Examples:

1. Dot notation with literal properties:
``json
{
  ".": [
    { "new": ["@Date"] }, 
    "getFullYear"
  ]
}
```

2. Bracket notation with variable reference:
``json
{
  "[]": ["@x", "@keyVariable"]
}
```

3. Bracket notation with literal string:
``json
{
  "[]": ["@x", "propertyName"]
}
```

4. Nested bracket access with variables:
``json
{
  "[]": [
    {
      "[]": ["@x", "@listName"]
    },
    "@propertyName"
  ]
}
```

### F. Yield Expressions

Yield expressions are used in generator functions to pause and resume execution, returning a value to the caller.

| JS Construct | Key/Structure | Value | Example (JS: yield value) |
|--------------|---------------|-------|-----------------------------|
| `yield expression` | `{"yield": expression}` | Expression that returns a value | |
| `yield* expression` | `{"yield*": expression}` | Expression that returns an iterable | |

#### JEON Example (Yield in generator function):

```json
{
  "function* counter()": [
    { "yield": 1 },
    { "yield": 2 },
    { "yield": 3 }
  ]
}
```

#### JEON Example (Yield* in generator function):

```json
{
  "function* combined()": [
    { "yield*": [1, 2, 3] },
    { "yield*": [4, 5, 6] }
  ]
}
```

### G. Await Expressions

Await expressions are used in async functions to pause execution until a Promise is resolved.

| JS Construct | Key/Structure | Value | Example (JS: await promise) |
|--------------|---------------|-------|-----------------------------|
| `await expression` | `{"await": expression}` | Expression that returns a Promise | |

#### JEON Example (Await in async function):

```json
{
  "async function fetchData()": [
    {
      "@": {
        "response": {
          "await": {
            "()": ["@fetch", "/api/data"]
          }
        }
      }
    },
    {
      "return": "@response"
    }
  ]
}
```

### H. Break Statements

| JS Construct | Key/Structure | Value | Example (JS: break) |
|--------------|---------------|-------|---------------------|
| `break` | `{"break": null}` | null (no label) | |
| `break label` | `{"break": "label"}` | String (label name) | |

#### JEON Example (Break statement):

``json
{
  "for": [
    { "@": { "i": 0 } },
    { "<": ["@i", 10] },
    { "++": ["@i"] },
    [
      {
        "if": [
          { "==": ["@i", 5] },
          { "break": null }
        ]
      }
    ]
  ]
}
```

## 2. Control Flow and Variable Management

The structure uses the scope type (`@` for `let` declarations, `@@` for `const` declarations) as the key. The value is an object mapping the variable name (without `@` prefix) to its initial expression or value.

| JS Construct | Key/Structure | Value | Example (JS: let a = 1) |
|--------------|---------------|-------|-------------------------|
| `let name = expr` | `{"@": { "name": expr }}` | Object (Name/Value map) | |
| `const name = expr` | `{"@@": { "name": expr }}` | Object (Name/Value map) | |

#### JEON Example:

```json
{
  "@": {
    "count": 0,
    "isValid": {
      "===": [{ ".": ["@data", "status"] }, "OK"]
    }
  },
  "@@": {
    "PI": 3.14159,
    "MAX_SIZE": 100
  }
}
```

### B. Execution Block (Sequencing)

An array of expressions executed sequentially. Used implicitly as the root of a function body or explicitly for multi-step logic.

| Concept | Key/Structure | Value |
|---------|---------------|-------|
| Sequence | Array of expressions | `[expr1, expr2, ...]` |

#### JEON Example (Sequential Execution):

```json
[
  { "@": { "x": 10 } },
  { "setAppState()": ["@x"] },
  { "alertMessage()": ["Value set."] }
]
```

### C. Loop and Switch Structures

These structures enable repetitive execution and branching logic. The body of the loop or case is always represented by a single expression or an Execution Block (an Array of expressions).

| JS Construct | Key/Structure | Value | Explanation |
|--------------|---------------|-------|-------------|
| While Loop | `while (c) { body }` | `{"while": [c, body]}` | `c` is the condition expression, `body` is the execution block. |
| For Loop | `for (init; cond; incr) { body }` | `{"for": [init, cond, incr, body]}` | Sequence of initialization, condition, increment expressions, and the loop body. |
| Switch Block | `switch (exp)` | `{"switch": [exp, cases, default]}` | `exp` is the expression to match. `cases` is an object mapping case values to bodies. `default` is optional. |

#### JEON Examples:

1. While Loop (JS: `while (count < 5) { count++ }`):

```json
{
  "while": [
    { "<": ["@count", 5] },
    { "++": ["@count"] }
  ]
}
```

2. For Loop (JS: `for (let i = 0; i < 10; i++) { log(i) }`):

```json
{
  "for": [
    { "@": { "i": 0 } },
    { "<": ["@i", 10] },
    { "++": ["@i"] },
    { "log()": ["@i"] }
  ]
}
```

3. Switch Statement:

```json
{
  "switch": [
    "@user_role",
    {
      "admin": [
        { "setPermissions()": ["full"] }
      ],
      "editor": [
        { "setPermissions()": ["write"] }
      ]
    },
    [
      { "setPermissions()": ["read"] }
    ]
  ]
}
```

### D. Class Definition and Inheritance

The class operator is used to define an object constructor (a class) with optional inheritance and a set of properties and methods.

| JS Construct | Key/Structure | Value | Explanation |
|--------------|---------------|-------|-------------|
| `class Name extends Parent { ... }` | `{"class Name": { ... }}` | Object (Class Configuration) | Defines a class with the given name. The properties of this object define instance fields and methods. |
| `const Name = class { ... }` | `{"@@": { "Name": { "class": { ... } }}` | Object (Class Configuration) | Defines an assigned class with the given name. The properties of this object define instance fields and methods. |

#### Class Configuration Structure:

| Property | Description | Type |
|----------|-------------|------|
| extends | The reference to the parent class (optional). | Reference |
| Instance Field/Method | Defines instance fields, methods, or accessors. | Object |

##### Instance Field/Method Definitions:

| JS Construct | JEON Structure | Explanation |
|--------------|----------------|-------------|
| Field | `"propName": value` | Simple data field assigned upon instantiation. |
| Method | `"methodName": { function_declaration }` | Function defined using 1.B syntax. |
| Getter | `"get propName": { function_declaration }` | Function that calculates and returns a value. |
| Setter | `"set propName": { function_declaration }` | Function that receives a single parameter (the new value) and updates state. |

#### JEON Example (Class with Getter/Setter):

```json
{
  "class Person": {
    "constructor(name)": {
      "function(name)": [
        {
          "=": [
            {
              ".": [
                "@this",
                "name"
              ]
            },
            "@name"
          ]
        }
      ]
    },
    "get fullName": {
      "function()": [
        {
          "return": {
            ".": [
              "@this",
              "name"
            ]
          }
        }
      ]
    },
    "greet()": {
      "function()": [
        {
          "return": {
            "+": [
              "Hello, ",
              {
                ".": [
                  "@this",
                  "name"
                ]
              }
            ]
          }
        }
      ]
    }
  }
}
```

#### JEON Example (Assigned Class):

```json
{
  "@@": {
    "Animal": {
      "class": {
        "constructor(species)": {
          "function(species)": [
            {
              "=": [
                {
                  ".": [
                    "@this",
                    "species"
                  ]
                },
                "@species"
              ]
            }
          ]
        },
        "getType()": {
          "function()": [
            {
              "return": {
                ".": [
                  "@this",
                  "species"
                ]
              }
            }
          ]
        }
      }
    }
  }
}
```

### E. Object Literal Accessors

Object accessors can be defined directly within an object literal assignment using the special `get` and `set` keys.

#### JEON Example (Object Literal with Accessors):

```json
{
  "@": {
    "rect": {
      "width": 10,
      "height": 5,
      "get area": {
        "()=>": { "*": [{ ".": ["@this", "width"] }, { ".": ["@this", "height"] }] }
      },
      "set dimensions": {
        "(val)=>": [
          { "@": { "width": { ".": ["@val", 0] } } },
          { "@": { "height": { ".": ["@val", 1] } } }
        ]
      }
    }
  }
}
```

## 3. Spread Operator

The spread operator is used to expand arrays or objects.

| JS Construct | Key/Structure | Value | Example (JS: ...array) |
|--------------|---------------|-------|------------------------|
| Array Spread | `{"...": expression}` | Expression that evaluates to an array | |
| Object Spread | `{"...": expression}` | Expression that evaluates to an object | |

#### JEON Example (Array Spread):

```json
{
  "@": {
    "a": [
      1,
      2,
      {
        "...": [3, 4]
      },
      5
    ]
  }
}
```

This represents: `let a = [1, 2, ...[3, 4], 5];`

#### JEON Example (Object Spread):

```json
{
  "@": {
    "obj": {
      "...": {
        "a": 1,
        "b": 2
      },
      "c": 3
    }
  }
}
```

This represents: `let obj = {...{a: 1, b: 2}, c: 3};`

## 4. JSX / Component Structure

Component structures use the tag name enclosed in angle brackets as the key. Properties (including event handlers) are defined as direct key-value pairs within the component object, and child elements are stored under the reserved key `children`.

| Key | Description | Type |
|-----|-------------|------|
| children | An ordered list of nested JEON expressions (components, text, or results of function calls). | Array |

| JS Construct | Key/Structure | Value | Example (JS: let comp = <div...>) |
|--------------|---------------|-------|----------------------------------|
| `<Tag ...>` | `{"<Tag>": { ... }}` | Object (containing attributes and children) | |

#### JEON Example (JS: `let comp = <div className="card">Hello World!</div>`):

```json
{
  "@": {
    "comp": {
      "<div>": {
        "className": "p-4 bg-white rounded shadow-lg",
        "data-testid": "main-card",
        "children": [
          "Hello World!"
        ]
      }
    }
  }
}
```

### Complex Component Example

Combining a function call with a component structure:

``json
{
  "<button>": {
      "className": "submit-btn",
      "onClick": {
        // Function call expression used as a property value
        "submitForm()": ["@formData"]
      },
    "children": [
      {
        "<span>": {
          "children": ["Save"]
        }
      }
    ]
  }
}
```

## 5. Safe Evaluation and Security

Because JEON can be constructed from untrusted sources, its execution environment must be securely sandboxed to prevent access to sensitive global objects, filesystem, or network functions.

### A. Environment Sandboxing (Mandatory)

The JEON interpreter must execute code in an environment where the following global objects are not directly accessible, mutable, or callable, even through dynamic property access (e.g., using the `.` or `()` operators):

- Browser APIs: `window`, `document`, `XMLHttpRequest`, `fetch`, `localStorage`, `history`, `location`, `setTimeout`, `setInterval`, `alert`, `prompt`, `confirm`.
- Node.js/System APIs: `process`, `require`, `fs`, `eval`, `Function`, `Buffer`.
- Reflective APIs: `Reflect`, `Proxy`, `Object.getOwnPropertyNames` (when applied to sandboxed objects).

### B. Whitelisting of Global References

Only explicitly whitelisted, safe global objects should be available via the `@` reference mechanism, typically limited to:

- Primitives: `null`, `true`, `false`.
- Standard safe constructors and utility functions: `Object`, `Array`, `String`, `Number`, `Boolean`, `Date`, `Math`, `JSON`.

### C. Enforcement for `.` and `()` Operators

The implementation of the Member Access (`.`) and Function Execution (`()`) operators must strictly check the target object (`target_expression`) and the member name (`segmentN` or the function being called) against the security whitelist.

- Any attempt to use the `.` operator to access a property that resolves to a blacklisted constructor (e.g., trying to access `window` via `global.window`) must throw an evaluation error.
- Any attempt to use the `()` operator to call a blacklisted function (e.g., `alert()`) or a method on a blacklisted object must throw an evaluation error.

## Detailed Operator Examples

### 1. Parentheses Operator `(`
The parentheses operator is used to group expressions and control evaluation order.

**JEON Structure:**
```json
{
  "(": expression
}
```

**Examples:**

1. Simple grouping:
```json
{
  "(": {
    "+": [1, 2]
  }
}
```
JavaScript equivalent: `(1 + 2)`

2. Complex expression grouping:
```json
{
  "*": [
    {
      "(": {
        "+": [1, 2]
      }
    },
    3
  ]
}
```
JavaScript equivalent: `(1 + 2) * 3`

### 2. Function Call Operator `()`
The function call operator is used to invoke functions. It takes an array where the first element is the function reference and subsequent elements are arguments.

**JEON Structure:**
```json
{
  "()": [function_expression, arg1, arg2, ...]
}
```

**Examples:**

1. Calling a method on an object:
```json
{
  "()": [
    {
      ".": ["@Math", "abs"]
    },
    -5
  ]
}
```
JavaScript equivalent: `Math.abs(-5)`

2. Calling a function stored in a variable:
```json
{
  "()": ["@myFunction", "@arg1", "@arg2"]
}
```
JavaScript equivalent: `myFunction(arg1, arg2)`

### 3. Property Access Operator `.`

The property access operator is used to access properties of objects. It takes an array where the first element is the object and subsequent elements are property names.

**JEON Structure:**
```json
{
  ".": [object_expression, property1, property2, ...]
}
```

**Examples:**

1. Simple property access:
```json
{
  ".": ["@obj", "prop"]
}
```
JavaScript equivalent: `obj.prop`

2. Chained property access:
```json
{
  ".": ["@obj", "prop1", "prop2"]
}
```
JavaScript equivalent: `obj.prop1.prop2`

3. Method access:
```json
{
  ".": ["@array", "push"]
}
```
JavaScript equivalent: `array.push`

### 4. New Operator

The new operator is used to create instances of classes or constructors.

**JEON Structure:**
```json
{
  "new": [constructor, arg1, arg2, ...]
}
```

**Examples:**

1. Creating a new Date object:
```json
{
  "new": ["Date"]
}
```
JavaScript equivalent: `new Date()`

2. Creating a new Date with arguments:
```json
{
  "new": ["Date", 0]
}
```
JavaScript equivalent: `new Date(0)`

### 5. Spread Operator `...`

The spread operator is used to expand arrays or objects.

**JEON Structure:**
```json
{
  "...": expression
}
```

**Examples:**

1. Array spread:
```json
{
  "@": {
    "arr": [
      1,
      2,
      {
        "...": [3, 4, 5]
      },
      6
    ]
  }
}
```
JavaScript equivalent: `let arr = [1, 2, ...[3, 4, 5], 6]`

2. Object spread:
```json
{
  "@": {
    "obj": {
      "...": {
        "a": 1,
        "b": 2
      },
      "c": 3
    }
  }
}
```
JavaScript equivalent: `let obj = {...{a: 1, b: 2}, c: 3}`

### 6. Arrow Function Operator `=>`

Arrow functions are defined using the `=>` operator. The key is a string that specifies the parameters, and the value is the function body.

**JEON Structure:**
```json
{
  "(param1, param2, ...) =>": body
}
```

**Examples:**

1. Simple arrow function with no parameters:
```json
{
  "()=>": 42
}
```
JavaScript equivalent: `() => 42`

2. Arrow function with parameters returning an expression:
```json
{
  "(a, b) =>": {
    "+": ["@a", "@b"]
  }
}
```
JavaScript equivalent: `(a, b) => a + b`

3. Arrow function with parameters returning an object:
```json
{
  "(name) =>": {
    "name": "@name",
    "greeting": {
      "+": ["Hello , "@name"]
    }
  }
}
```
JavaScript equivalent: `(name) => ({ name: name, greeting: "Hello " + name })`

### 7. Assignment Operator `=`

The assignment operator is used to assign values to variables.

**JEON Structure:**
```json
{
  "=": [target, value]
}
```

**Examples:**

1. Simple variable assignment:
```json
{
  "=": ["@x", 5]
}
```
JavaScript equivalent: `x = 5`

2. Property assignment:
```json
{
  "=": [
    {
      ".": ["@obj", "prop"]
    },
    "value"
  ]
}
```
JavaScript equivalent: `obj.prop = "value"`

### 8. Conditional Operator `?`

The conditional operator (ternary operator) is used for conditional expressions.

**JEON Structure:**
```json
{
  "?": [condition, trueValue, falseValue]
}
```

**Examples:**

1. Simple conditional:
```json
{
  "?": [
    {
      ">": ["@x", 0]
    },
    "positive",
    "non-positive"
  ]
}
```
JavaScript equivalent: `x > 0 ? "positive" : "non-positive"`

### 9. If Statement `if`

The if operator is used for conditional execution of statements.

**JEON Structure:**
```json
{
  "if": [condition, trueBlock, falseBlock]
}
```

**Examples:**

1. Simple if statement:
```json
{
  "if": [
    {
      ">": ["@x", 0]
    },
    {
      "log()": ["positive"]
    }
  ]
}
```
JavaScript equivalent: `if (x > 0) { log("positive"); }`

2. If-else statement:
```json
{
  "if": [
    {
      ">": ["@x", 0]
    },
    {
      "log()": ["positive"]
    },
    {
      "log()": ["non-positive"]
    }
  ]
}
```
JavaScript equivalent: `if (x > 0) { log("positive"); } else { log("non-positive"); }`

### 10. While Loop `while`

The while operator is used for repetitive execution while a condition is true.

**JEON Structure:**
```json
{
  "while": [condition, body]
}
```

**Examples:**

1. Simple while loop:
```json
{
  "while": [
    {
      "<": ["@i", 10]
    },
    {
      "++": "@i"
    }
  ]
}
```
JavaScript equivalent: `while (i < 10) { ++i; }`

### 11. For Loop `for`

The for operator is used for repetitive execution with initialization, condition, and increment expressions.

**JEON Structure:**
```json
{
  "for": [init, condition, increment, body]
}
```

**Examples:**

1. Simple for loop:
```json
{
  "for": [
    {
      "@": {
        "i": 0
      }
    },
    {
      "<": ["@i", 10]
    },
    {
      "++": "@i"
    },
    {
      "log()": ["@i"]
    }
  ]
}
```
JavaScript equivalent: `for (let i = 0; i < 10; i++) { log(i); }`

### 12. Function Declarations

Function declarations in JEON use special keys that specify the function type and parameters.

**JEON Structure:**
```json
{
  "function(param1, param2, ...)": [body_statements]
}
```

**Examples:**

1. Simple function declaration:
```json
{
  "function add(a, b)": [
    {
      "return": {
        "+": ["@a", "@b"]
      }
    }
  ]
}
```
JavaScript equivalent: `function add(a, b) { return a + b; }`

2. Function with no parameters:
```json
{
  "function getValue()": [
    {
      "return": 42
    }
  ]
}
```
JavaScript equivalent: `function getValue() { return 42; }`

### 13. Async Function Declarations

Async function declarations are similar to regular function declarations but use the `async function` prefix.

**JEON Structure:**
```json
{
  "async function(param1, param2, ...)": [body_statements]
}
```

**Examples:**

1. Simple async function:
```json
{
  "async function fetchData()": [
    {
      "return": {
        "await": {
          "fetch()": ["/api/data"]
        }
      }
    }
  ]
}
```
JavaScript equivalent: `async function fetchData() { return await fetch("/api/data"); }`

### 14. Generator Function Declarations

Generator function declarations use the `function*` prefix.

**JEON Structure:**
```json
{
  "function*(param1, param2, ...)": [body_statements]
}
```

**Examples:**

1. Simple generator function:
```json
{
  "function* counter()": [
    {
      "yield": 1
    },
    {
      "yield": 2
    },
    {
      "yield": 3
    }
  ]
}
```
JavaScript equivalent: `function* counter() { yield 1; yield 2; yield 3; }`

### 15. Return Statement

The return operator is used to return values from functions.

**JEON Structure:**
```json
{
  "return": expression
}
```

**Examples:**

1. Return a value:
```json
{
  "return": {
    "+": ["@a", "@b"]
  }
}
```
JavaScript equivalent: `return a + b;`

2. Return without a value:
```json
{
  "return": null
}
```
JavaScript equivalent: `return;`

### 16. Yield Statement

The yield operator is used in generator functions to produce values.

**JEON Structure:**
```json
{
  "yield": expression
}
```

**Examples:**

1. Yield a value:
```json
{
  "yield": 42
}
```
JavaScript equivalent: `yield 42;`

2. Yield without a value:
```json
{
  "yield": null
}
```
JavaScript equivalent: `yield;`

### 17. Await Expression

The await operator is used in async functions to wait for Promises.

**JEON Structure:**
```json
{
  "await": expression
}
```

**Examples:**

1. Await a Promise:
```json
{
  "await": {
    "fetch()": ["/api/data"]
  }
}
```
JavaScript equivalent: `await fetch("/api/data");`

### 18. Variable Declarations

Variable declarations in JEON use special operators for different types of variables.

**JEON Structure:**
```json
{
  "@": {  // for let/var declarations
    "variableName": initialValue
  },
  "@@": {  // for const declarations
    "constantName": initialValue
  }
}
```

**Examples:**

1. Let/var declaration:
```json
{
  "@": {
    "x": 5,
    "y": {
      "+": [1, 2]
    }
  }
}
```
JavaScript equivalent: `let x = 5; let y = 1 + 2;`

2. Const declaration:
```json
{
  "@@": {
    "PI": 3.14159,
    "MAX_SIZE": 100
  }
}
```
JavaScript equivalent: `const PI = 3.14159; const MAX_SIZE = 100;`

3. Uninitialized variable (using sentinel value):
```json
{
  "@": {
    "uninitializedVar": "@undefined"
  }
}
```
JavaScript equivalent: `let uninitializedVar;`

## Operator Precedence and Associativity

In JEON, operator precedence and associativity are determined by the structure of the JSON objects rather than implicit rules. Parentheses `()` can be used to explicitly control evaluation order when needed.

## Security Considerations

JEON is designed with security in mind. The explicit nature of all operations means that potentially dangerous constructs must be explicitly represented in the JSON structure, making it easier to validate and sanitize before execution.

1. No implicit code execution - all function calls must use the explicit `()` operator
2. No dynamic property access shortcuts - all member access must use the explicit `.` operator
3. All operations are explicitly represented in the JSON structure, making validation possible
4. The evalJeon function provides a safe evaluation environment with a restricted context

### Special Value Representations

JEON provides special representations for certain JavaScript values that require distinction for proper serialization and deserialization.

#### Undefined Values

In JEON, undefined values are represented with special sentinel strings to distinguish between different semantic meanings:

| JEON Representation | JavaScript Equivalent | Description |
|---------------------|-----------------------|-------------|
| `@undefined` | uninitialized variable | Represents an uninitialized variable declaration (e.g., `let x;`) |
| `@@undefined` | explicit undefined assignment | Represents an explicit undefined assignment (e.g., `let x = undefined;`) |

**Examples:**

1. Uninitialized variable:
```json
{
  "@": {
    "x": "@undefined"
  }
}
```
JavaScript equivalent: `let x;`

2. Explicit undefined assignment:
```json
{
  "@": {
    "x": "@@undefined"
  }
}
```
JavaScript equivalent: `let x = undefined;`

3. Const with explicit undefined:
```json
{
  "@@": {
    "CONST_UNDEFINED": "@@undefined"
  }
}
```
JavaScript equivalent: `const CONST_UNDEFINED = undefined;`

#### Sparse Arrays

Sparse arrays in JEON use special representations to distinguish between holes and explicit undefined values:

| JEON Representation | JavaScript Equivalent | Description |
|---------------------|-----------------------|-------------|
| `@undefined` | array hole (consecutive commas) | Represents a hole in a sparse array (e.g., `[1,,2]`) |
| `@@undefined` | explicit undefined in array | Represents an explicit undefined value in an array (e.g., `[1,undefined,2]`) |

**Example:**
```json
{
  "@@": {
    "sparsedArray": [
      0,
      "@undefined",
      "@undefined",
      "@@undefined",
      0
    ]
  }
}
```
JavaScript equivalent: `const sparsedArray = [0, , , undefined, 0];`

### Comment Operators

JEON supports multiple comment operators to represent different types of JavaScript comments.

#### Single-line Comments (`//`)

The `//` operator is used to represent JavaScript single-line comments.

**JEON Structure:**
```json
{
  "//": "comment text"
}
```

**Example:**
```json
{
  "//": "This is a single-line comment"
}
```
JavaScript equivalent: `// This is a single-line comment`

#### Multi-line Block Comments (`/*`)

The `/*` operator is used to represent JavaScript multi-line block comments. It supports both array and string formats.

**JEON Structure:**
```json
{
  "/*": ["line1", "line2", "line3"]
}
```
or
```json
{
  "/*": "single line comment"
}
```

**Examples:**

1. Multi-line block comment:
```json
{
  "/*": [
    " This is a multi-line",
    " block comment",
    " with multiple lines "
  ]
}
```
JavaScript equivalent:
```
/* This is a multi-line
 block comment
 with multiple lines */
```

2. Single-line block comment:
```json
{
  "/*": " This is a single-line block comment "
}
```
JavaScript equivalent: `/* This is a single-line block comment */`

### Regular Expression Operator (`/ /`)

The `/ /` operator is used to represent JavaScript regular expressions.

**JEON Structure:**
```json
{
  "/ /": {
    "pattern": "regex pattern",
    "flags": "regex flags"
  }
}
```

**Example:**
```json
{
  "/ /": {
    "pattern": "abc",
    "flags": "gi"
  }
}
```
JavaScript equivalent: `/abc/gi`

### BigInt Support

JEON supports BigInt values through string representation when using JSON5. BigInt values are represented as strings with an 'n' suffix to indicate they are BigInt literals.

**JEON Structure:**
```json
{
  "bigintPropertyName": "1234567890123456789n"
}
```

**Example:**
```json
{
  "@@": {
    "BIG_NUMBER": "1234567890123456789n"
  }
}
```
JavaScript equivalent: `const BIG_NUMBER = 1234567890123456789n;`

**Implementation Details:**
BigInt support is enabled through the `@mainnet-pat/json5-bigint` library which extends JSON5 with BigInt serialization capabilities. To use BigInt support:

1. Import JSON5 with BigInt support:
   ```javascript
   import JSON5 from '@mainnet-pat/json5-bigint';
   ```

2. Enable BigInt in global options:
   ```javascript
   globalThis.JSON5Options = Object.assign(globalThis.JSON5Options ?? {}, { bigint: true });
   ```

3. Pass the JSON5 implementation to js2jeon and jeon2js:
   ```javascript
   const jeon = js2jeon(code, { json: JSON5 });
   const js = jeon2js(jeon, { json: JSON5 });
   ```

**Note:** Regular JSON does not support BigInt serialization. When using standard JSON, BigInt values cannot be properly serialized and will result in errors.
