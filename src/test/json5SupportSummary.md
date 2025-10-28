# JSON5 Support in JEON Converter - Summary

## Overview
This document summarizes the implementation and benefits of JSON5 support in the JEON (JSON-based Executable Object Notation) converter.

## Implementation Details

### 1. Updated Function Signatures
- **`js2jeon(code: string, options?: { json?: typeof JSON })`**: Accepts optional JSON implementation
- **`jeon2js(jeon: any, options?: { json?: typeof JSON })`**: Accepts optional JSON implementation

### 2. JSON5 Wrapper
A wrapper is used to make JSON5 compatible with the standard JSON interface:
```javascript
const JSON5Wrapper = {
  stringify: JSON5.stringify,
  parse: JSON5.parse,
  [Symbol.toStringTag]: 'JSON'
}
```

### 3. Visitor Pattern Updates
All visitor functions in both `js2jeon.visitors` and `jeon2js.visitors` have been updated to accept and pass through the options parameter.

## Key Benefits

### 1. Improved Key Formatting
**Standard JSON JEON:**
```json
{
  "@@": {
    "obj": {
      "special-key": "value"
    }
  }
}
```

**JSON5 JEON:**
```json5
{
  '@@': {
    obj: {
      'special-key': 'value',
    },
  },
}
```

### 2. Better Readability
- Unquoted keys where possible
- Consistent use of single quotes for strings
- Trailing commas support
- More JavaScript-like syntax

### 3. Enhanced Compatibility
- Better handling of special characters in keys
- Support for Unicode keys
- Preservation of key formatting in round-trip conversions

## Usage Examples

### JavaScript to JEON
```javascript
import { js2jeon } from './js2jeon'
import * as JSON5 from 'json5'

const code = `const obj = { "special-key": "value" };`
const jeon = js2jeon(code, { json: JSON5Wrapper })
```

### JEON to JavaScript
```javascript
import { jeon2js } from './jeon2js'
import * as JSON5 from 'json5'

const jeon = { "@@": { "obj": { "special-key": "value" } } }
const code = jeon2js(jeon, { json: JSON5Wrapper })
```

## Test Results

### Round-trip Compatibility
✅ All key elements preserved in round-trip conversion
✅ Special characters in keys maintained
✅ Complex JavaScript features supported (async/await, classes, etc.)

### Size Comparison
- Minimal size difference between JSON and JSON5 JEON representations
- JSON5 formatting can be slightly more compact due to unquoted keys

### Feature Support
✅ Comments in source code (processed by parser)
✅ Trailing commas (processed by parser)
✅ Single quotes (visible in JEON output)
✅ Unquoted keys (visible in JEON output)
✅ Special numeric values (Infinity, NaN)

## Integration with Web Interface
The web interface has been updated to use the appropriate JSON implementation based on user selection:
- When "Use JSON5" is checked, both `js2jeon` and `jeon2js` use JSON5
- When unchecked, standard JSON is used

## Conclusion
The JSON5 support enhancement provides:
1. **Better formatting** - More readable JEON representations
2. **Enhanced compatibility** - Better handling of JavaScript-like syntax
3. **Backward compatibility** - Existing code continues to work unchanged
4. **User choice** - Users can select their preferred JSON implementation

The implementation follows the same pattern for both conversion directions and maintains full API compatibility.