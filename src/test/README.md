# Test Conversion Guide

This directory contains tests that have been converted to use the @woby/chk framework for browser-based testing.

## Converted Tests

The following tests have been converted to use @woby/chk:

1. `functionRoundTrip.test.ts` - Tests function round-trip conversion
2. `variableRoundTrip.test.ts` - Tests variable declaration round-trip conversion
3. `json5RoundTrip.test.ts` - Tests JSON5 round-trip conversion
4. `roundTripFunction.test.ts` - Additional function round-trip tests
5. `class.test.ts` - Tests class conversion
6. `function.test.ts` - Tests various function types
7. `letConst.test.ts` - Tests let and const declarations
8. `json5Feature.test.ts` - Tests JSON5 features
9. `minifiedComparison.test.ts` - Tests round-trip conversion with normalized code comparison
10. `directComparison.test.ts` - Tests direct string comparison of original and regenerated code
11. `variablePatternComparison.test.ts` - Tests different variable declaration patterns

## Shared Utilities

All tests now use a shared utility function for code normalization:

- `testUtils.ts` - Contains the `normalizeJs` function that standardizes JavaScript code for comparison

This eliminates code duplication and ensures consistent normalization across all tests.

## Running Tests

To run the @woby/chk tests, use the chk command directly:

```bash
# Run all test files
chk src/test/*.test.ts

# Run specific test file
chk src/test/functionRoundTrip.test.ts

# Run comparison tests
chk src/test/*Comparison.test.ts
```

Note: Due to compatibility issues with npm scripts, run the chk command directly from the terminal rather than through npm scripts.

## Test Structure

Each converted test follows the @woby/chk pattern:

1. **Import from @woby/chk** - Uses `import { expect, test } from '@woby/chk'`
2. **Import shared utilities** - Uses `import { normalizeJs } from './testUtils'`
3. **Test suites** - Groups related tests using `test()` functions
4. **Assertions** - Uses `expect()` with matchers like `toBe()`, `toContain()`, etc.
5. **Browser environment** - Runs in a happy-dom environment that simulates browser APIs

## Key Behavioral Insights

The comparison tests reveal important behaviors of the JEON converter:

1. **Variable Declaration Normalization**: Combined variable declarations (e.g., `let a = 1, b = 2;`) are normalized to separate declarations (e.g., `let a = 1; let b = 2;`) during round-trip conversion.

2. **Code Structure Preservation**: Despite normalization, the semantic meaning and structure of the code is preserved.

3. **High Fidelity Conversion**: For simple constructs, the round-trip conversion maintains high similarity to the original code.

4. **JSON5 Support**: The converter properly handles JSON5 features like special keys, trailing commas, and comments.

## Why @woby/chk?

The @woby/chk framework provides several advantages:

1. **Browser-based testing** - Runs tests in a browser-like environment
2. **Rich assertions** - Provides a comprehensive set of matchers
3. **Interactive debugging** - Allows for browser-based debugging
4. **Visual test reporting** - Provides clear test results with emojis and formatting

## Legacy Tests

Some tests in this directory still use the simple assertion-based approach for Node.js environments:

1. `roundTripFunctionTest.ts` - Tests function round-trip conversion
2. `variableRoundTripTest.ts` - Tests variable declaration round-trip conversion
3. `json5RoundTripTest.ts` - Tests JSON5 round-trip conversion

These can be run with:
```bash
pnpm tsx src/test/roundTripFunctionTest.ts
```

## Test Runner Scripts

Helper scripts are available to run legacy tests:

- `runAllConverted.bat` - Windows batch file to run legacy tests
- `runAllConverted.sh` - Bash script to run legacy tests