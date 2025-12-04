# JEON Closure Feature Specification

## Overview

The JEON (JSON-based Executable Object Notation) closure feature provides a secure execution environment for dynamically generated JavaScript code. When enabled, this feature wraps functions in a safe evaluation mechanism that prevents access to potentially dangerous global objects and APIs while maintaining full functionality for legitimate use cases.

## Purpose

The closure feature addresses security concerns when executing JEON expressions that originate from untrusted sources. It ensures that:

1. Generated JavaScript code cannot access browser APIs like `window`, `document`, `fetch`, etc.
2. Code cannot access Node.js APIs like `process`, `require`, `fs`, etc.
3. Execution happens in a controlled sandboxed environment
4. Legitimate functionality is preserved through a whitelisted context

## Implementation Details

### How It Works

When the `closure` option is enabled in `jeon2js`, functions are transformed to use the `evalJeon` function instead of directly executing JavaScript code. This approach:

1. Preserves the original JEON structure as a stringified JSON object
2. Creates a controlled execution context with only whitelisted globals
3. Executes the function body through the safe `evalJeon` interpreter

### Function Transformation Examples

#### Regular Mode (closure=false)
```javascript
function add(a, b) {
  return a + b;
}
```

#### Closure Mode (closure=true)
```javascript
function add(a, b) { 
  return evalJeon({
    "return": {
      "+": ["@a", "@b"]
    }
  }, {a: a, b: b}); 
}
```

## Supported Constructs

### 1. Function Declarations
All types of function declarations are supported with closure mode:

- Traditional functions: `function name(params)`
- Arrow functions: `(params) =>`
- Async functions: `async function name(params)`
- Generator functions: `function* name(params)`

### 2. Class Methods
Class methods, getters, and setters are also wrapped when closure mode is enabled:

```javascript
class Calculator {
  add(a, b) { 
    return evalJeon({
      "return": {
        "+": ["@a", "@b"]
      }
    }, {a: a, b: b, this: this}); 
  }
  
  get value() { 
    return evalJeon({
      "return": "@value"
    }, {this: this}); 
  }
}
```

### 3. Static Methods
Static methods in classes are also supported:

```javascript
class MathUtils {
  static add(a, b) { 
    return evalJeon({
      "return": {
        "+": ["@a", "@b"]
      }
    }, {a: a, b: b}); 
  }
}
```

## Safe Context

The closure feature provides a safe execution context that includes:

### Whitelisted Globals
- `Math` - Mathematical operations
- `Number`, `String`, `Boolean` - Type constructors
- `Array`, `Object`, `Date` - Data structure constructors
- `JSON` - JSON operations
- `isNaN`, `isFinite`, `parseInt`, `parseFloat` - Utility functions
- `console` - Logging capabilities
- Constants: `undefined`, `null`, `true`, `false`, `Infinity`, `NaN`

### Context Injection
When functions are executed, the following are automatically added to the context:
- Function parameters
- `this` context for class methods
- Any additional context provided by the caller

## Security Features

### 1. Restricted Global Access
The closure feature prevents access to dangerous globals:
- Browser APIs: `window`, `document`, `fetch`, `XMLHttpRequest`, etc.
- Node.js APIs: `process`, `require`, `fs`, etc.
- Reflection APIs: `eval`, `Function`, `Reflect`, etc.

### 2. Explicit Member Access
All property access must use the explicit `.` operator:
- ✅ `{".": ["@obj", "prop"]}` - Allowed
- ❌ `@obj.prop` - Not allowed (throws error)

### 3. Explicit Function Calls
All function calls must use the explicit `()` operator:
- ✅ `{"()": ["@func", "arg"]}` - Allowed
- ❌ `"func(arg)"` - Not allowed (throws error)

## Usage

### Enabling Closure Mode

```typescript
import { jeon2js } from 'jeon';

const jeon = {
  "function add(a, b)": [
    {
      "return": {
        "+": ["@a", "@b"]
      }
    }
  ]
};

// Regular mode
const regularJs = jeon2js(jeon);

// Closure mode
const safeJs = jeon2js(jeon, { closure: true });
```

### Evaluating JEON with Closure

```typescript
import { evalJeon } from 'jeon';

const jeon = {
  "function": "(a, b) =>",
  "+": ["@a", "@b"]
};

// Create the function
const addFunc = evalJeon(jeon, { /* additional context */ });

// Use the function
const result = addFunc(5, 3); // Returns 8
```

## Benefits

1. **Security**: Prevents access to dangerous APIs while preserving functionality
2. **Compatibility**: Maintains full JEON feature support
3. **Performance**: Minimal overhead for most use cases
4. **Flexibility**: Can be selectively enabled for specific transformations
5. **Debugging**: Preserves original JEON structure for easier debugging

## Limitations

1. **Performance**: Slight overhead due to interpretation vs direct execution
2. **Context**: Requires careful management of execution context
3. **Complexity**: Adds complexity to the transformation pipeline

## Best Practices

1. **Enable selectively**: Only use closure mode when executing untrusted code
2. **Provide context**: Ensure necessary variables are available in the execution context
3. **Validate input**: Always validate JEON structures before transformation
4. **Monitor performance**: Be aware of performance implications in hot paths
5. **Error handling**: Implement proper error handling for evaluation failures

## Example Use Cases

### 1. Plugin Systems
Executing user-provided JEON expressions in a secure environment:

```typescript
const pluginCode = {
  "function processData(data)": [
    {
      "@": {
        "result": {
          "*": ["@data", 2]
        }
      }
    },
    {
      "return": "@result"
    }
  ]
};

const safeProcessor = evalJeon(pluginCode, {});
const output = safeProcessor(21); // Returns 42
```

### 2. Formula Evaluation
Safely evaluating mathematical expressions:

```typescript
const formula = {
  "(x, y) =>": {
    "+": [
      {
        "*": ["@x", "@x"]
      },
      {
        "*": ["@y", "@y"]
      }
    ]
  }
};

const hypotenuseSquared = evalJeon(formula, {});
const result = hypotenuseSquared(3, 4); // Returns 25
```

## Conclusion

The JEON closure feature provides a robust security mechanism for executing dynamically generated code while preserving the full functionality of the JEON notation system. By wrapping functions in the safe `evalJeon` interpreter, it creates a secure execution environment that prevents access to dangerous APIs while maintaining access to necessary functionality through a carefully curated whitelist of safe globals.