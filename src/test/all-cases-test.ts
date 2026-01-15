import { js2jeon } from '../js2jeon'
import { evalJeon } from '../safeEval'
//@ts-ignore
import chalk from 'chalk'

function colorizeJson(obj: any) {
    const json = JSON.stringify(obj, null, 2)

    // This regex matches:
    // 1. Keys (strings followed by a colon)
    // 2. String values (strings NOT followed by a colon)
    // 3. Primitives (numbers, booleans, null)
    const regex = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g

    return json.replace(regex, (match) => {
        let cls = 'number' // default to number logic for simplicity if not string/bool

        // Check if it's a string (starts with ")
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key'
            } else {
                cls = 'string'
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean'
        } else if (/null/.test(match)) {
            cls = 'null'
        }

        // Apply colors
        switch (cls) {
            case 'key':
                // Remove the colon, color the key blue, add the colon back (uncolored or colored per preference)
                // User preference was to color the whole "key": blue
                return chalk.blue(match)
            case 'string':
                return chalk.green(match)
            case 'number':
                return chalk.yellow(match)
            case 'boolean':
                return chalk.cyan(match)
            case 'null':
                return chalk.magenta(match)
            default:
                return match
        }
    })
}

// Deep equality function for comparing JEON structures
function deepEqual(a: any, b: any): boolean {
    if (a === b) return true

    // Special case for undefined vs "undefined" string
    if (a === undefined && b === "undefined") return true
    if (a === "undefined" && b === undefined) return true

    if (a == null || b == null) return a === b

    if (typeof a !== typeof b) return false

    if (typeof a !== 'object') return a === b

    if (Array.isArray(a) !== Array.isArray(b)) return false

    if (Array.isArray(a)) {
        if (a.length !== b.length) return false
        for (let i = 0; i < a.length; i++) {
            if (!deepEqual(a[i], b[i])) return false
        }
        return true
    }

    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    if (keysA.length !== keysB.length) return false

    for (const key of keysA) {
        if (!keysB.includes(key)) return false
        if (!deepEqual(a[key], b[key])) return false
    }

    return true
}

// Test all cases from _.ts file
const testCases = [
    {
        name: 'case1', code: `
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
  specialNumbers: [Infinity, /* negative (not supported) */ -Infinity, -0, NaN],
  someData: new Uint8Array([1, 2, 3, 4, 5]),
  set: new Set([1, 2, 3]),
  map: new Map([[1, 1], // end of line
  [2, 2]]),
  sameRefs: [item, item, item],
  sparsedArray: [0,,, undefined, 0],
}    
` },
    {
        name: 'case2', code: `
function a(name) { return ("Hello, " + name) }
`, jeon: {
            "function a(name)": [
                {
                    "return": {
                        "(": {
                            "+": [
                                "Hello, ",
                                "@name"
                            ]
                        }
                    }
                }
            ]
        }, eval: undefined
    },
    {
        name: 'case3', code: `
function a(name) { return ("Hello, " + name) }
a('world')
`, jeon: {
            "@": {
                "a": {
                    "function a(name)": [
                        {
                            "return": {
                                "(": {
                                    "+": [
                                        "Hello, ",
                                        "@name"
                                    ]
                                }
                            }
                        }
                    ]
                }
            },
            "()": [
                "@a",
                "world"
            ]
        }, eval: "Hello, world"
    },
    {
        name: 'case2_1', code: `
function (name) { return ("Hello, " + name) }
`, jeon: {
            "function (name)": [
                {
                    "return": {
                        "(": {
                            "+": [
                                "Hello, ",
                                "@name"
                            ]
                        }
                    }
                }
            ]
        }, eval: "function"
    },
    {
        name: 'case4', code: `
let count = 0; let message = "Hello World"
`, jeon: {
            "@": {
                "count": 0,
                "message": "Hello World"
            }
        }, eval: undefined
    },
    {
        name: 'case5', code: `
(x) => { return (x * 2); }
`, jeon: {
            "(x) =>": {
                "return": {
                    "(": {
                        "*": [
                            "@x",
                            2
                        ]
                    }
                }
            }
        }, eval: "function"
    }, {
        name: 'case6', code: `
((x) => { return (x * 2); })(10)
`, jeon: {
            "(": {
                "()": [
                    {
                        "(x) =>": {
                            "return": {
                                "(": {
                                    "*": [
                                        "@x",
                                        2
                                    ]
                                }
                            }
                        }
                    },
                    10
                ]
            }
        }, eval: 20
    },
    {
        name: 'case7', code: `
function* countUpTo(max) {
  yield 1;
  yield 2;
  return max;
}
`, jeon: {
            "function* countUpTo(max)": [
                {
                    "yield": 1
                },
                {
                    "yield": 2
                },
                {
                    "return": "@max"
                }
            ]
        }, eval: undefined
    }, {
        name: 'case8', code: `
function* countUpTo(max) {
  yield 1;
  yield 2;
  return max;
}
countUpTo(10)
`, jeon: {
            "@": {
                "countUpTo": {
                    "function* countUpTo(max)": [
                        {
                            "yield": 1
                        },
                        {
                            "yield": 2
                        },
                        {
                            "return": "@max"
                        }
                    ]
                }
            },
            "()": [
                "@countUpTo",
                10
            ]
        }, eval: {}
    },
    {
        name: 'case9', code: `
function* countUpTo(max) {
  yield 1;
  yield 2;
  return max;
}
[...countUpTo(10)]
`, jeon: {
            "@": {
                "countUpTo": {
                    "function* countUpTo(max)": [
                        {
                            "yield": 1
                        },
                        {
                            "yield": 2
                        },
                        {
                            "return": "@max"
                        }
                    ]
                }
            },
            "@@": {
                "spreadResult": {
                    "...": {
                        "()": [
                            "@countUpTo",
                            10
                        ]
                    }
                }
            },
            "[]": [
                "@@spreadResult"
            ]
        }, eval: [1, 2]
    },
    {
        name: 'case10', code: `
let element = <div className="container">
  <h1>Hello World</h1>
</div>;
`, jeon: {
            "@": {
                "element": {
                    "div": {
                        "className": "container",
                        "children": [
                            {
                                "h1": {
                                    "children": "Hello World"
                                }
                            }
                        ]
                    }
                }
            }
        }, eval: undefined
    },
    {
        name: 'case11', code: `
<div className="container">
  <h1>Hello World</h1>
</div>;
`, jeon: {
            "div": {
                "className": "container",
                "children": [
                    {
                        "h1": {
                            "children": "Hello World"
                        }
                    }
                ]
            }
        }, eval: "[object Object]"
    },
    {
        name: 'case12', code: `
let a = [1, 2, ...[3, 4], 5];
`, jeon: {
            "@": {
                "a": [
                    1,
                    2,
                    {
                        "...": [
                            3,
                            4
                        ]
                    },
                    5
                ]
            }
        }, eval: undefined
    },
    {
        name: 'case13', code: `
[1, 2, ...[3, 4], 5];
`, jeon: {
            "@@": {
                "spreadArray": [
                    1,
                    2,
                    {
                        "...": [
                            3,
                            4
                        ]
                    },
                    5
                ]
            },
            "[]": [
                "@@spreadArray"
            ]
        }, eval: [1, 2, 3, 4, 5]
    },
    {
        name: 'case13_1', code: `
[1, 2, [3, 4], 5];
`, jeon: {
            "@@": {
                "nestedArray": [
                    1,
                    2,
                    [
                        3,
                        4
                    ],
                    5
                ]
            },
            "[]": [
                "@@nestedArray"
            ]
        }, eval: [1, 2, [3, 4], 5]
    },
    {
        name: 'case14', code: `
{}
`, jeon: {
            "(": {}
        }, eval: {}
    },
    {
        name: 'case15', code: `
{a:1, b:2}
`, jeon: {
            "(": {
                "a": 1,
                "b": 2
            }
        }, eval: { "a": 1, "b": 2 }
    },
    {
        name: 'case16', code: `
{
    const a = 1;
    const b = 2;
    return a + b
}
`, jeon: {
            "(": {
                "()": [
                    {
                        "() =>": {
                            "@": {
                                "a": 1,
                                "b": 2
                            },
                            "return": {
                                "+": [
                                    "@a",
                                    "@b"
                                ]
                            }
                        }
                    },
                    []
                ]
            }
        }, eval: 3
    },
    {
        name: 'case17', code: `
    const a = 1;
    const b = 2;
    return a + b
`, jeon: {
            "(": {
                "()": [
                    {
                        "() =>": {
                            "@": {
                                "a": 1,
                                "b": 2
                            },
                            "return": {
                                "+": [
                                    "@a",
                                    "@b"
                                ]
                            }
                        }
                    },
                    []
                ]
            }
        }, eval: 3
    },
    {
        name: 'case18', code: `
    const a = 1;
    const b = 2;
`, jeon: {
            "@": {
                "a": 1,
                "b": 2
            }
        }, eval: undefined
    },
    {
        name: 'case19', code: `
    const a = 1;
    a
`, jeon: {
            "@": {
                "a": 1
            },
            "lastStatement": "@a"
        }, eval: 1
    },
    {
        name: 'case20', code: `
    function (a){return a}
`, jeon: {
            "function (a)": [
                {
                    "return": "@a"
                }
            ]
        }, eval: "function"
    },
    {
        name: 'case21', code: `
    (function (a){return a+1})(10)
`, jeon: {
            "(": {
                "()": [
                    {
                        "function (a)": [
                            {
                                "return": {
                                    "+": [
                                        "@a",
                                        1
                                    ]
                                }
                            }
                        ]
                    },
                    10
                ]
            }
        }, eval: 11
    },
    {
        name: 'case22', code: `
class Person {
  constructor(name) {
  this.name = name
};
  greet() {
  return ("Hello, " + this.name)
}
}
`, jeon: {
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
                                "(": {
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
                        }
                    ]
                }
            }
        }, eval: "function"
    },
    {
        name: 'case23', code: `
class Person {
  constructor(name) {
  this.name = name
};
  greet() {
  return ("Hello, " + this.name)
}
}
new Person('Alex')
`, jeon: {
            "@@": {
                "Person": {
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
                                        "(": {
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
                                }
                            ]
                        }
                    }
                }
            },
            "new": [
                "@Person",
                "Alex"
            ]
        }, eval: "[object Object]"
    },
    {
        name: 'case24', code: `
class Person {
  constructor(name) {
  this.name = name
};
  greet() {
  return ("Hello, " + this.name)
}
}
new Person('Alex').greet()
`, jeon: {
            "@@": {
                "Person": {
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
                                        "(": {
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
                                }
                            ]
                        }
                    }
                }
            },
            "()": [
                {
                    ".": [
                        {
                            "new": [
                                "@Person",
                                "Alex"
                            ]
                        },
                        "greet"
                    ]
                }
            ]
        }, eval: "Hello, Alex"
    },
    {
        name: 'case25', code: `
new (class Person {
  constructor(name) {
  this.name = name
};
  greet() {
  return ("Hello, " + this.name)
}
})('Ali')
`, jeon: {
            "new": [
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
                                        "(": {
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
                                }
                            ]
                        }
                    }
                },
                "Ali"
            ]
        }, eval: "[object Object]"
    },
    {
        name: 'case26', code: `
new (class Person {
  constructor(name) {
  this.name = name
};
  greet() {
  return ("Hello, " + this.name)
}
})('Mary').greet()
`, jeon: {
            "()": [
                {
                    ".": [
                        {
                            "new": [
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
                                                        "(": {
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
                                                }
                                            ]
                                        }
                                    }
                                },
                                "Mary"
                            ]
                        },
                        "greet"
                    ]
                }
            ]
        }, eval: "Hello, Mary"
    },
    {
        name: 'case27', code: `
class {
  constructor(name) {
  this.name = name
};
  greet() {
  return ("Hello, " + this.name)
}
}
`, jeon: {
            "class ": {
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
                                "(": {
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
                        }
                    ]
                }
            }
        }, eval: "function"
    },
    {
        name: 'case28', code: `
new (class {
  constructor(name) {
  this.name = name
};
  greet() {
  return ("Hello, " + this.name)
}
})('Danial')
`, jeon: {
            "new": [
                {
                    "class ": {
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
                                        "(": {
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
                                }
                            ]
                        }
                    }
                },
                "Danial"
            ]
        }, eval: { "name": "Danial" }
    },
    {
        name: 'case29', code: `
new (class {
  constructor(name) {
  this.name = name
};
  greet() {
  return ("Hello, " + this.name)
}
})('John').greet()
`, jeon: {
            "()": [
                {
                    ".": [
                        {
                            "new": [
                                {
                                    "class ": {
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
                                                        "(": {
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
                                                }
                                            ]
                                        }
                                    }
                                },
                                "John"
                            ]
                        },
                        "greet"
                    ]
                }
            ]
        }, eval: "Hello, John"
    },
    {
        name: 'case30', code: `
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
`, jeon: {
            "@@": {
                "Calculator": {
                    "class Calculator": {
                        "static add(a, b)": {
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
                        },
                        "static multiply(a, b)": {
                            "function(a, b)": [
                                {
                                    "return": {
                                        "*": [
                                            "@a",
                                            "@b"
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            "+": [
                {
                    "()": [
                        {
                            ".": [
                                "@Calculator",
                                "add"
                            ]
                        },
                        1,
                        4
                    ]
                },
                {
                    "()": [
                        {
                            ".": [
                                "@Calculator",
                                "multiply"
                            ]
                        },
                        1,
                        4
                    ]
                }
            ]
        }, eval: 9
    },
    {
        name: 'case31', code: `
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
`, jeon: {
            "@@": {
                "Calculator": {
                    "class Calculator": {
                        "static add(a, b)": {
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
                        },
                        "static multiply(a, b)": {
                            "function(a, b)": [
                                {
                                    "return": {
                                        "*": [
                                            "@a",
                                            "@b"
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            "@": {
                "add": {
                    ".": [
                        "@Calculator",
                        "add"
                    ]
                },
                "multiply": {
                    ".": [
                        "@Calculator",
                        "multiply"
                    ]
                }
            },
            "+": [
                {
                    "()": [
                        "@add",
                        1,
                        4
                    ]
                },
                {
                    "()": [
                        "@multiply",
                        1,
                        4
                    ]
                }
            ]
        }, eval: 9
    },
    {
        name: 'case32', code: `
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
`, jeon: {
            "@": {
                "Calculator": {
                    "add": {
                        "(a, b) =>": {
                            "return": {
                                "+": [
                                    "@a",
                                    "@b"
                                ]
                            }
                        }
                    },
                    "multiply": {
                        "(a, b) =>": {
                            "return": {
                                "*": [
                                    "@a",
                                    "@b"
                                ]
                            }
                        }
                    }
                },
                "add": {
                    ".": [
                        "@Calculator",
                        "add"
                    ]
                },
                "multiply": {
                    ".": [
                        "@Calculator",
                        "multiply"
                    ]
                }
            },
            "+": [
                {
                    "()": [
                        "@add",
                        1,
                        4
                    ]
                },
                {
                    "()": [
                        "@multiply",
                        1,
                        4
                    ]
                }
            ]
        }, eval: 9
    },
    {
        name: 'case33', code: `
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

add(1, 4) + multiply(1, 4) + ' ' + name()
`, jeon: {
            "@": {
                "Calculator": {
                    "add": {
                        "(a, b) =>": {
                            "return": {
                                "+": [
                                    "@a",
                                    "@b"
                                ]
                            }
                        }
                    },
                    "multiply": {
                        "(a, b) =>": {
                            "return": {
                                "*": [
                                    "@a",
                                    "@b"
                                ]
                            }
                        }
                    },
                    "get name()": {
                        "function()": [
                            {
                                "return": "Cal"
                            }
                        ]
                    }
                },
                "add": {
                    ".": [
                        "@Calculator",
                        "add"
                    ]
                },
                "multiply": {
                    ".": [
                        "@Calculator",
                        "multiply"
                    ]
                },
                "name": {
                    ".": [
                        "@Calculator",
                        "name"
                    ]
                }
            },
            "+": [
                {
                    "+": [
                        {
                            "()": [
                                "@add",
                                1,
                                4
                            ]
                        },
                        {
                            "()": [
                                "@multiply",
                                1,
                                4
                            ]
                        }
                    ]
                },
                " ",
                "@name"
            ]
        }, eval: "9 Cal"
    },
    {
        name: 'case34', code: `
function(...a) { return a }
`, jeon: {
            "function(...a)": [
                {
                    "return": "@a"
                }
            ]
        }, eval: "function"
    },
    {
        name: 'case35', code: `
(function(...a) { return a.length })([1, 2, 3, 4, 5])
`, jeon: {
            "(": {
                "()": [
                    {
                        "function(...a)": [
                            {
                                "return": {
                                    ".": [
                                        "@a",
                                        "length"
                                    ]
                                }
                            }
                        ]
                    },
                    [
                        1,
                        2,
                        3,
                        4,
                        5
                    ]
                ]
            }
        }, eval: 1
    },
    {
        name: 'case36', code: `
function a(...a) { return a.length }
a([1, 2, 3, 4, 5])
`, jeon: {
            "@": {
                "a": {
                    "function a(...a)": [
                        {
                            "return": {
                                ".": [
                                    "@a",
                                    "length"
                                ]
                            }
                        }
                    ]
                }
            },
            "()": [
                "@a",
                [
                    1,
                    2,
                    3,
                    4,
                    5
                ]
            ]
        }, eval: 1
    },
    {
        name: 'case37', code: `
const {a,b, ...rest} = {a:1, b:3}
a+b
`, jeon: {
            '@@': {
                '=': [
                    [
                        '@a',
                        '@b',
                        '...@rest',
                    ],
                    {
                        a: 1,
                        b: 3,
                    },
                ],
            },
        }, eval: 4
    },
    {
        name: 'case38', code: `
const [head, a,b, ...rest] = [1, 2, 3, 4, 5]
a+b
`, jeon: [
            {
                '@@': {
                    '=': [
                        [
                            '@head',
                            'a',
                            'b',
                            '...@rest',
                        ],
                        [
                            1,
                            2,
                            3,
                            4,
                            5,
                        ],
                    ],
                },
            },
            {
                '+': [
                    '@a',
                    '@b',
                ],
            },
        ], eval: 5
    },
    {
        name: 'case39', code: `
const [x, y, [nestedA, nestedB]] =  {
        x: 1,
        y: 2,
        z: {
          nestedA: 3,
          nestedB: 4
        }
      }
        
x + y + ' ' +  nestedA + ' ' + nestedB
`, jeon: [
            {
                '@@': {
                    '=': [
                        [
                            'x',
                            'y',
                            '[@nestedA, @nestedB]',
                        ],
                        {
                            x: 1,
                            y: 2,
                            z: {
                                nestedA: 3,
                                nestedB: 4,
                            },
                        },
                    ],
                },
            },
            {
                '+': [
                    {
                        '+': [
                            {
                                '+': [
                                    {
                                        '+': [
                                            {
                                                '+': [
                                                    '@x',
                                                    '@y',
                                                ],
                                            },
                                            ' ',
                                        ],
                                    },
                                    '@nestedA',
                                ],
                            },
                            ' ',
                        ],
                    },
                    '@nestedB',
                ],
            },
        ], eval: "3 3 4"
    },
    {
        name: 'case40', code: `
const [a, , b] = [1, 2, 3]
a + b
`, jeon: [
            {
                '@@': {
                    '=': [
                        [
                            '@a',
                            null,
                            '@b',
                        ],
                        [
                            1,
                            2,
                            3,
                        ],
                    ],
                },
            },
            {
                '+': [
                    '@a',
                    '@b',
                ],
            },
        ], eval: 4
    },
    {
        name: 'case41', code: `
const [first, ...rest] = [1, 2, 3, 4, 5]
first + rest.length
`, jeon: [
            {
                '@@': {
                    '=': [
                        [
                            '@first',
                            '...@rest',
                        ],
                        [
                            1,
                            2,
                            3,
                            4,
                            5,
                        ],
                    ],
                },
            },
            {
                '+': [
                    '@first',
                    {
                        '.': [
                            '@rest',
                            'length',  // Changed from '@length'
                        ],
                    },
                ],
            },
        ], eval: 5
    },
]

// Test each case sequentially
function runTests() {
    let passedTests = 0
    let failedTests = 0
    const failedTestIndex = []
    for (const testCase of testCases) {
        const { name, code, jeon: expectedJeon } = testCase
        try {
            console.log("Testing " + name + "...")
            const generatedJeon = js2jeon(code, { iife: true })

            // Always show the generated JEON for debugging
            console.log("Generated JEON:")
            console.log(colorizeJson(generatedJeon))

            const result = evalJeon(generatedJeon)
            
            // Compare eval result if expectedEval is provided
            if ('eval' in testCase) {
                const expectedEval = testCase.eval
                // Simplified evaluation logic
                let evalMatch = true
                if (expectedEval === undefined && result === undefined) {
                    // Special case for when both are undefined
                    evalMatch = true
                } else if (expectedEval === "undefined" && result === undefined) {
                    // Special case for string "undefined" vs actual undefined
                    evalMatch = true
                } else if (typeof expectedEval === 'object' && typeof result === 'object') {
                    evalMatch = deepEqual(result, expectedEval)
                } else if (typeof expectedEval === 'string' && expectedEval === '[object Object]' && typeof result === 'object') {
                    // Special case for object display
                    evalMatch = true
                } else if (typeof expectedEval === 'string' && expectedEval === '[object Generator]' && result && typeof result === 'object' && result.constructor && result.constructor.name === 'Generator') {
                    // Special case for generators
                    evalMatch = true
                } else if (typeof expectedEval === 'object' && result === undefined) {
                    // Special case for when we expect an object but get undefined
                    evalMatch = false
                } else if (typeof result == "function" && expectedEval == "function") {
                    evalMatch = true
                }
                else {
                    evalMatch = result === expectedEval
                }

                if (!evalMatch) {
                    console.log(chalk.red("❌ Eval result mismatch for " + name))
                    console.log("Expected result: " + JSON.stringify(expectedEval))
                    console.log("Actual result: " + JSON.stringify(result))
                    failedTestIndex.push(name)
                    failedTests++
                } else {
                    console.log(chalk.green("✅ Eval result matches for " + name))
                    console.log("Expected result: " + JSON.stringify(expectedEval))
                    console.log("Actual result: " + JSON.stringify(result))
                    passedTests++
                }
            } else {
                // If no expected eval is provided, we assume the test passes if no exception was thrown
                console.log(chalk.green("✅ " + name + " executed without errors"))
                passedTests++
            }
            console.log('---')
        } catch (error: any) {
            failedTests++
            failedTestIndex.push(name)
            console.error(chalk.red("Error in " + name + ": " + error.message))
            console.error(error.stack)
            console.log('---')
        }
    }

    console.log(`\n${chalk.bold('Test Summary:')}`)
    console.log(chalk.green(`Passed: ${passedTests}`))
    console.log(chalk.red(`Failed: ${failedTests}`))
    console.log(`Total: ${passedTests + failedTests}`)
    console.log("failedTestIndex", failedTestIndex)
}

runTests()