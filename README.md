# JEON Converter

A bidirectional converter between JEON (JSON-based Executable Object Notation) and TypeScript/JavaScript.

[View the full JEON specification](./spec.md)

[View detailed operator documentation](./OPERATORS.md)
## Overview

## Demo

Playground: [https://jeonts.github.io/jeonjs//](https://jeonts.github.io/jeonjs)

Repository: [https://github.com/jeonts/jeonjs](https://github.com/jeonts/jeonjs)


This library provides two main functions:
1. `jeon2js(jeon)` - Converts JEON objects to executable JavaScript code
2. `js2jeon(code)` - Converts JavaScript code to JEON format

JEON is a method for representing executable JavaScript constructs—such as operations, functions, and components—using only standard JSON objects, arrays, and literals. This enables easy serialization and transport of executable logic.

## Installation

```bash
pnpm install
```

## Building

```bash
pnpm build
```

## API Usage

### `jeon2js(jeon: any, options?: { json?: typeof JSON, closure?: boolean }): string`

Converts a JEON object into a JavaScript code string. The optional `options` parameter can be used to specify a JSON implementation (e.g., JSON5) and enable closure mode for safe evaluation.

**Example: Converting a JEON function to JavaScript**

```
import { jeon2js } from 'jeon';

const jeonFunction = {
  "function(a, b)": [
    { "return": { "+": ["@a", "@b"] } }
  ]
};

const jsCode = jeon2js(jeonFunction);
console.log(jsCode);
```

Output (single line, always visible):

```
function(a, b) { return (a + b); }
```

### Closure Mode for Safe Evaluation

When the `closure` option is set to `true`, function declarations, arrow functions, getters, and setters are wrapped with `evalJeon()` calls for safe evaluation, preventing XSS attacks:

```
import { jeon2js } from 'jeon';

const jeonFunction = {
  "function(a, b)": [
    { "return": { "+": ["@a", "@b"] } }
  ]
};

const jsCode = jeon2js(jeonFunction, { closure: true });
console.log(jsCode);
```

Output (single line, always visible):

```
function(a, b) { return evalJeon([{"return":{"+":["@a","@b"]}}], {a, b}); }
```

For arrow functions with parameters:

```
import { jeon2js } from 'jeon';

const jeonArrowFunction = {
  "(x) =>": {
    "return": { "+": ["Hello World", "@x"] }
  }
};

const jsCode = jeon2js(jeonArrowFunction, { closure: true });
console.log(jsCode);
```

Output:

```
(x) => evalJeon({"return":{"+":["Hello World","@x"]}}, {x})
```

### `js2jeon(code: string, options?: { json?: typeof JSON }): any`

Converts a JavaScript code string into a JEON object. The optional `options` parameter can be used to specify a JSON implementation (e.g., JSON5).

**Example: Converting a JavaScript function to JEON**

```
import { js2jeon } from 'jeon';

const tsCode = `
function sum(a, b) {
  return a + b;
}
`;

const jeon = js2jeon(tsCode);
console.log(JSON.stringify(jeon, null, 2));
```

Output (multi-line, collapsed by default in web documentation):

```
{
  "function(a, b)": [
    {
      "return": {
        "+": [
          "@a",
          "@b"
        ]
      }
    }
  ]
}
```

**Example: Converting a JavaScript class to JEON**

```
import { js2jeon } from 'jeon';

const classCode = `
class Person {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return "Hello, " + this.name;
  }
}
`;

const classJeon = js2jeon(classCode);
console.log(JSON.stringify(classJeon, null, 2));
```

Output (multi-line, collapsed by default in web documentation):

```
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

**Example: Converting JSX and Async/Await to JEON**

```
import { js2jeon } from 'jeon';

const jsxCode = `
async function fetchData() {
  const response = await fetch('/api/data');
  const data = await response.json();
  return data;
}

const element = <div className="container">
  <h1>Hello World</h1>
  <p>{fetchData}</p>
</div>
`;

const jsxJeon = js2jeon(jsxCode);
console.log(JSON.stringify(jsxJeon, null, 2));
```

Output (multi-line, collapsed by default in web documentation):

```
[
  {
    "async function fetchData()": [
      {
        "@": {
          "response": {
            "await": {
              "fetch()": [
                "/api/data"
              ]
            }
          }
        }
      },
      {
        "@": {
          "data": {
            "await": {
              "()": [
                {
                  ".": [
                    "@response",
                    "json"
                  ]
                }
              ]
            }
          }
        }
      },
      {
        "return": "@data"
      }
    ]
  },
  {
    "@": {
      "element": {
        "<div>": {
          "className": "container",
          "children": [
            {
              "<h1>": {
                "children": [
                  "Hello World"
                ]
              }
            },
            {
              "<p>": {
                "children": [
                  "@fetchData"
                ]
              }
            }
          ]
        }
      }
    }
  }
]
```


## Examples

Run the example script to see the converter in action:

```bash
pnpm example
```

## API

### `jeon2js(jeon: any, options?: { json?: typeof JSON, closure?: boolean }): string`

Converts a JEON object to JavaScript code. When `closure` is set to `true`, function declarations, arrow functions, getters, and setters are wrapped with `evalJeon()` calls for safe evaluation.

### `js2jeon(code: string): any`

Converts JavaScript code to a JEON object.

## Supported JEON Constructs

- Function declarations (traditional and arrow functions)
- Variable declarations (`@` for `let`, `@@` for `const`)
- Infix operators (+, -, *, /, %, ==, ===, !=, !==, <, >, <=, >=, &&, ||)
- Ternary operator
- Conditional execution
- Loops (while, for)
- Switch statements
- Class definitions
- Member access and retrieval
- Function execution
- Constructor calls
- Component structures
- Generator functions (`function*`, `yield`, `yield*`)
- Async/await support
- Spread operator (`...` for arrays and objects)
- Break statements

## License

ISC