# IIFE Detection Logic in JEON - Summary

## What the Current Implementation Does

The IIFE detection logic in `index.tsx` (lines 247-285) is designed to automatically detect and unwrap Immediately Invoked Function Expressions (IIFEs) when users paste them into the playground.

### Supported Patterns

✅ **Basic Function IIFE**
```javascript
(function() { return 'hello'; })()
```

✅ **Basic Arrow Function IIFE**
```javascript
(() => { return 'hello'; })()
```

✅ **Async Arrow Function IIFE**
```javascript
(async () => { return 'hello'; })()
```

✅ **One Level of Extra Parentheses**
```javascript
((function() { return 'hello'; }))()
```

✅ **Complex Body IIFEs**
```javascript
(function() { const x = 1; const y = 2; return x + y; })()
```

### Unsupported Patterns

❌ **IIFEs with Arguments**
```javascript
(function(name) { return 'Hello, ' + name; })('World')
```
_Reason: The logic specifically requires zero arguments_

❌ **Multiple Levels of Parentheses**
```javascript
(((function() { return 'hello'; })))()
```
_Reason: The implementation only handles one level of parentheses unwrapping_

❌ **Regular Function Declarations**
```javascript
function normalFunction() { return 'hello'; }
```
_Reason: Not an IIFE (not immediately invoked)_

❌ **Function Assignments**
```javascript
const fn = function() { return 'hello'; }
```
_Reason: Not an IIFE (not immediately invoked)_

## How It Works

1. **Parse the code** with Acorn, preserving parentheses
2. **Check AST structure** for a single ExpressionStatement containing a CallExpression
3. **Verify zero arguments** in the call (ensures it's a simple IIFE)
4. **Unwrap one level** of parentheses from the callee if needed
5. **Check if callee** is a FunctionExpression or ArrowFunctionExpression
6. **Extract function code** by getting the substring from start to end positions

## Design Rationale

The limitations are intentional:

1. **Zero Arguments Requirement**: Simplifies the logic and covers the most common use case
2. **Single Parentheses Level**: 
   - Keeps implementation simple
   - Covers vast majority of real-world usage
   - Avoids complex recursive parsing

## Example Transformations

| Input | Output | Status |
|-------|--------|--------|
| `(function() { return 'hello'; })()` | `function() { return 'hello'; }` | ✅ Works |
| `(() => { return 'hello'; })()` | `() => { return 'hello'; }` | ✅ Works |
| `((function() { return 'hello'; }))()` | _No change_ | ❌ Doesn't work |
| `(function(name) { return name; })('World')` | _No change_ | ❌ Doesn't work |

This logic provides a good balance between functionality and simplicity for the JEON playground use case.