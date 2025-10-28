JEON Specification

The JEON Notation (JEON) is a method for representing executable JavaScript constructs—such as operations, functions, and components—using only standard JSON objects, arrays, and literals. This enables easy serialization and transport of executable logic.

Every valid JEON structure is a single JSON Object or Array where the key defines the operation, and the value supplies the necessary operands or body.

## Core Concepts

| Concept | Representation | Purpose |
|---------|----------------|---------|
| Expression | Object or Array | The fundamental unit of computation. |
| Reference | String prefixed with @ | Used to refer to defined variables, function parameters, or nested properties using dot notation only (e.g., `@name`, `@event.target.value`, `@x.data.label.color`). |
| Instance Reference | `@this` | Refers to the current object instance within a method or accessor. |
| Literal | String, Number, Boolean, null | Standard JSON values treated as constants. |

## JSON5 Support

While the JEON specification is based on standard JSON, the library also supports **JSON5**. This allows for a more human-readable and less verbose representation of JEON objects.

JSON5 features that can be used with JEON include:
- Unquoted object keys.
- Single-quoted strings.
- Trailing commas in objects and arrays.
- Comments.

To use JSON5, you can pass a JSON5 parser to the `js2jeon` and `jeon2js` functions in the `options` object:

```typescript
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

### C. Global/Scoped Function Call

The key is the function name followed by `()`, and the value is an array of arguments (expressions or literals). This is used for functions available in the global or local scope (like `log()`, `setAppState()`).

| JS Construct | Key/Structure | Value | Example (JS: fn(1, 2)) |
|--------------|---------------|-------|------------------------|
| `fn(arg1, arg2)` | `{"fn()": [arg1, arg2]}` | Array of arguments | |

#### JEON Example (Matches Selected Text Semantics: `setAppState(x)`):

```json
{
  "setAppState()": [
    "@x"
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

The concise `.` operator is used for retrieving a nested property's value or function object from a target. This represents sequential dot-access (`.`member) and index-access (`[key]`).

Structure: `{".": [target_expression, segment1, segment2, ...]}`

- `target_expression`: The starting object instance (e.g., `@x`, `{"new": [...]}`).
- `segmentN`: Represents a key lookup. If the segment is a literal string/number, it is used directly as the key (`target.key` or `target[index]`). If the segment is an object expression, it is evaluated to get the dynamic key (`target[evaluated_key]`).

| Type | JS Construct | JEON Structure | Explanation |
|------|--------------|----------------|-------------|
| Dot Access Chain | `x.list.pop` | `{".": ["@x", "list", "pop"]}` | Retrieves the pop function object from the array at `x.list`. |
| Indexed Access | `x[1]` | `{".": ["@x", 1]}` | Retrieves the value at index 1 of array `@x`. |
| Mixed Access | `x[1].data` | `{".": ["@x", 1, "data"]}` | Retrieves the data property from the object at `x[1]`. |
| Dynamic Key | `x[y.name]` | `{".": ["@x", {".": ["@y", "name"]}]}` | Retrieves the property from `x` using the key evaluated from `y.name`. |

#### JEON Example (Retrieving the current year function):

```json
{
  ".": [
    { "new": ["Date"] }, 
    "getFullYear"
  ]
}
```

### F. Function Execution (Invocation)

The concise `()` operator is used to execute a function object that has already been retrieved. The first argument must be the function to be called.

Structure for Execution: `{"()": [function_expression, arg1, arg2, ...]}`

- `function_expression`: An expression (often using the `.` operator) that resolves to a function object.
- `arg1, arg2, ...`: The arguments passed to the function.

| Type | JS Construct | JEON Structure | Method Call | `x.list.pop()` | `{"()": [{".": ["@x", "list", "pop"]}]}` |
|------|--------------|----------------|-------------|----------------|------------------------------------------|
| Method on Dynamic Result | `(new Date()).getFullYear()` | `{"()": [{".": [{ "new": ["Date"] }, "getFullYear"]}]}` |
| Static Method Call | `Math.sin(val)` | `{"()": [{".": ["@Math", "sin"]}, "@val"]}` |
| Function Variable | `f(arg)` | `{"()": ["@f", "@arg"]}` |

#### JEON Example (Invoking a function found via a chain):

```json
{
  "()": [
    { ".": ["@Math", "floor"] }, 
    { "getAppState()": [] } 
  ]
}
```

### G. Yield Expressions

Yield expressions are used in generator functions to pause and resume execution, returning a value to the caller.

| JS Construct | Key/Structure | Value | Example (JS: yield value) |
|--------------|---------------|-------|---------------------------|
| `yield value` | `{"yield": value}` | Expression to yield | |
| `yield* value` | `{"yield*": value}` | Expression to delegate to another generator | |

#### JEON Example (Yield in generator function):

```json
{
  "function* generator()": [
    { "yield": 1 },
    { "yield*": { "otherGenerator()": [] } },
    { "yield": 3 }
  ]
}
```

### H. Await Expressions

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

### I. Break Statements

Break statements are used to exit loops or switch statements.

| JS Construct | Key/Structure | Value | Example (JS: break) |
|--------------|---------------|-------|---------------------|
| `break` | `{"break": null}` | null (no label) | |
| `break label` | `{"break": "label"}` | String (label name) | |

#### JEON Example (Break statement):

```json
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

### A. Variable Declaration / Assignment

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
      "===": ["@data.status", "OK"]
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
        "()=>": { "*": ["@this.width", "@this.height"] }
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

```json
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