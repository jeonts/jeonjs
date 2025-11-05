---
trigger: always_on
alwaysApply: true
---
# @woby/chk: A Modern TypeScript Testing Toolkit

`@woby/chk` is a powerful and flexible testing toolkit designed to streamline unit and integration testing in TypeScript projects. It offers a comprehensive suite of utilities for writing robust and reliable tests with an intuitive, fluent API that will feel familiar to users of modern testing frameworks like Jest or Vitest.

Whether you're building a simple library or a complex application, `@woby/chk` provides the tools you need to ensure your code is working as expected. From simple value assertions to complex mocking and spying, `@woby/chk` has you covered.


## Installation

To get started with `@woby/chk`, install it as a dev dependency in your project:

```bash
pnpm install @woby/chk -D
```

## Configuration

`@woby/chk` is designed to work with modern build tools like Vite. Here is an example of how to configure Vite to use `@woby/chk` for your tests:

``typescript
// vite.config.mts
import { defineConfig } from 'vite'
import { snapshotPlugin } from 'vite-plugin-snapshot'
import { testPlugin } from '@woby/vite-plugin-test'

export default defineConfig({
  plugins: [
    snapshotPlugin(),
    testPlugin()
  ]
  /// other settings
})
```

To verify the snapshot server is running after configuration, visit `http://localhost:5174/@snapshot-api/version` in your browser. You should see version information if it's active.

## Consumer App Setup

To set up `@woby/chk` in your consumer application, you'll need to configure both the `snapshotPlugin` and `testPlugin` in your Vite configuration. Here's a detailed guide on how to set up and use these plugins for different types of testing:

### Native TSX/TS Testing

For native TypeScript/TSX testing, create test files with `.test.ts` or `.test.tsx` extensions. The `testPlugin` will automatically discover and serve these files.

Example test file (`src/components/MyComponent.test.tsx`):

```tsx
import { expect, test } from '@woby/chk'
import { MyComponent } from './MyComponent'

test('MyComponent should render with correct message', async () => {
  const component = <MyComponent message="Hello World" count={5} timestamp={new Date()} />
  // Add your assertions here
  expect(component).toBeDefined()
})
```

### Component Story Format for TSX

For component story format testing, you can create HTML files that demonstrate your components in different states. The `testPlugin` will automatically combine these files when serving the test page.

Example story file (`src/components/components.test.html`):

```html
<!DOCTYPE html>
<html>
<head>
    <title>Component Stories</title>
</head>
<body>
    <h1>MyComponent Stories</h1>
    
    <h2>Default State</h2>
    <woby-chk>
        <my-component message="Hello World" count={1} timestamp={new Date()}></my-component>
    </woby-chk>
    
    <h2>With Custom Message</h2>
    <woby-chk>
        <my-component message="Custom Message" count={10} timestamp={new Date()}></my-component>
    </woby-chk>
</body>
</html>
```

### HTML (Custom Element) Testing

For testing custom elements, you can create HTML test files that directly use your custom elements. The `testPlugin` will serve these files and the `snapshotPlugin` will allow you to take snapshots of the rendered components.

Example custom element test (`src/components/another-component.html`):

```html
<!DOCTYPE html>
<html>
<head>
    <title>Custom Element Test</title>
</head>
<body>
    <h1>AnotherComponent Test</h1>
    <woby-chk>
        <another-component></another-component>
    </woby-chk>
    
    <h1>MyComponent2 Test</h1>
    <woby-chk>
        <my-component2 message="Hello Custom Element"></my-component2>
    </woby-chk>
</body>
</html>
```

## Running the Example

To run the example tests, follow these steps:

1.  Clone the repository:

    ```bash
    git clone https://github.com/wobyjs/chk.git
    ```

2.  Navigate to the `example` directory:

    ```bash
    cd chk/example
    ```

3.  Install dependencies:

    ```bash
    pnpm i
    ```

4.  Run the tests:

    ```bash
    pnpm test
    ```

## Usage

Here is a simple example of how to write a test with `@woby/chk`:

```typescript
// src/example.test.ts
import { expect, test } from '@woby/chk';

function sum(a: number, b: number) {
  return a + b;
}

//ALWAYS USE TEST SUBJECT AS TITLE
test('sum(1, 2)', () => 
  expect(sum(1, 2)).toBe(3);
});
```

# Excuting Test
```bash
cd folder && chk ./src/test/*.test.ts
```
as pnpm test with "test":"chk ./src/test/*.test.ts" //may fail 


# API Documentation

## Expect API

The `expect` API is the cornerstone of writing effective tests in `chk`. It provides a fluent and intuitive interface for making assertions about values, allowing you to verify that your code behaves as expected. By chaining `expect()` with various matcher functions, you can express a wide range of conditions and validate the state, behavior, and output of your application. This API is designed to be highly readable and expressive, making your tests clear and easy to understand.

### .toBe()

The `.toBe()` matcher is used to test for strict equality. It compares values using the `===` operator, meaning both the value and the type must be the same for the assertion to pass. This matcher is ideal for primitive values like numbers, strings, and booleans, as well as for checking if two variables reference the exact same object in memory.

### .toEqual()

The `.toEqual()` matcher is used for deep equality comparison, particularly useful for objects and arrays. Unlike `.toBe()`, which checks for strict identity, `.toEqual()` recursively checks the properties of objects and elements of arrays to ensure they have the same values. This allows you to compare complex data structures without worrying about whether they are the exact same instance in memory.

### .not

The `.not` modifier allows you to negate the result of any subsequent matcher. This is useful for asserting that a condition is false, providing a clear and readable way to express negative assertions in your tests.

### .resolves

The `.resolves` matcher is used to work with promises. It unwraps the value from a resolved promise, allowing you to chain further assertions on that value. This is essential for testing asynchronous code in a clean and readable manner.

### .rejects

The `.rejects` matcher is the counterpart to `.resolves`. It is used to assert that a promise is rejected. You can chain this with other matchers, like `.toThrow()`, to make assertions about the rejection reason (the error).

### .toHaveBeenCalled()

The `.toHaveBeenCalled()` matcher asserts that a mock function (created with `fn()` or `spyOn()`) has been called at least once. This is a fundamental assertion for verifying that a particular piece of code was executed as part of a test.

### .toHaveBeenCalledTimes()

The `.toHaveBeenCalledTimes()` matcher asserts that a mock function was called an exact number of times. This is useful for ensuring that a function is called a specific number of times, no more and no less.

### .toHaveBeenCalledWith()

The `.toHaveBeenCalledWith()` matcher asserts that a mock function was called with specific arguments. This allows you to verify not just that a function was called, but also that it received the correct inputs.

### .toHaveBeenCalledLastCalledWith()

The `.toHaveBeenCalledLastCalledWith()` matcher asserts that the most recent call to a mock function was made with specific arguments. This is useful for testing scenarios where the final interaction with a mock is the most important one.

### .toHaveBeenCalledNthCalledWith()

The `.toHaveBeenCalledNthCalledWith()` matcher asserts that the Nth call to a mock function was made with specific arguments. This provides fine-grained control for verifying the arguments of each call in a sequence.

### .toHaveReturnedTimes()

The `.toHaveReturnedTimes()` matcher asserts that a mock function has returned a value a specific number of times. This is useful for checking how many times a function successfully completed its execution.

### .toHaveReturnedWith()

The `.toHaveReturnedWith()` matcher asserts that a mock function returned a specific value at least once. This is useful for verifying the output of a function.

### .toHaveLastReturnedWith()

The `.toHaveLastReturnedWith()` matcher asserts that the last successful return from a mock function was a specific value. This is useful for checking the result of the final call to a function.

### .toHaveNthReturnedWith()

The `.toHaveNthReturnedWith()` matcher asserts that the Nth successful return from a mock function was a specific value. This allows you to inspect the return value of each individual call.

### .toHaveLength()

The `.toHaveLength()` matcher asserts that an object has a `.length` property and that its value is equal to a specific number. This is commonly used for arrays and strings.

### .toHaveProperty()

The `.toHaveProperty()` matcher asserts that an object has a property at a given key path. You can optionally also assert that the property has a specific value.

### .toBeCloseTo()

The `.toBeCloseTo()` matcher is used to compare floating-point numbers. It asserts that a number is close to another number within a specified precision, which helps avoid issues with floating-point inaccuracies.

### .toBeDefined()

The `.toBeDefined()` matcher asserts that a value is not `undefined`. This is a simple way to check that a variable has been assigned a value.

### .toBeFalsy()

The `.toBeFalsy()` matcher asserts that a value is "falsy" in a boolean context. The values that are considered falsy are `false`, `0`, `''` (empty string), `null`, and `undefined`.

### .toBeTruthy()

The `.toBeTruthy()` matcher asserts that a value is "truthy" in a boolean context. Any value that is not falsy is considered truthy.

### .toBeInstanceOf()

The `.toBeInstanceOf()` matcher asserts that an object is an instance of a specific class or constructor. This is useful for checking the type of an object.

### Numeric Comparisons

These matchers are used for comparing numeric values.

#### .toBeGreaterThan()

Asserts that a number is greater than another number.

#### .toBeGreaterThanOrEqual()

Asserts that a number is greater than or equal to another number.

#### .toBeLessThan()

Asserts that a number is less than another number.

#### .toBeLessThanOrEqual()

Asserts that a number is less than or equal to another number.

#### Comparison Operators (>, >=, <, <=)

You can also use the direct comparison operators for a more concise syntax.

### .toBeNull()

The `.toBeNull()` matcher asserts that a value is strictly equal to `null`.

### .toBeUndefined()

The `.toBeUndefined()` matcher asserts that a value is strictly equal to `undefined`.

### .toBeNaN()

The `.toBeNaN()` matcher asserts that a value is `NaN` (Not a Number).

### .toContain()

The `.toContain()` matcher asserts that an array or string contains a specific item or substring. For arrays, it uses strict equality (`===`) to check for the presence of the item.

### .toContainEqual()

The `.toContainEqual()` matcher asserts that an array contains an element that is deeply equal to the expected value. This is useful for checking for the presence of objects in an array.

### .toMatch()

The `.toMatch()` matcher asserts that a string matches a regular expression or a substring. This is useful for validating string formats, such as URLs, email addresses, or any other pattern-based text.

### .toMatchObject()

The `.toMatchObject()` matcher asserts that an object matches a subset of the properties of another object. This is particularly useful when you want to check for the presence and value of specific keys in an object without needing to verify the entire object structure.

### .toStrictEqual()

The `.toStrictEqual()` matcher asserts that a value is strictly equal to another value. It performs a deep comparison, including checking that the types and structures of the objects are the same.

### .toBeOneOf()

The `.toBeOneOf()` matcher asserts that a value is present in a given array of values.

### .toBeTypeOf()

The `.toBeTypeOf()` matcher asserts that a value is of a specific primitive type, as determined by `typeof`.

### .toHaveResolved()

The `.toHaveResolved()` matcher asserts that a promise returned by a spy function has resolved.

### .toHaveResolvedTimes()

The `.toHaveResolvedTimes()` matcher asserts that a promise returned by a spy function has resolved a specific number of times.

### .toHaveResolvedWith()

The `.toHaveResolvedWith()` matcher asserts that a promise returned by a spy function has resolved with a specific value.

### .toHaveLastResolvedWith()

The `.toHaveLastResolvedWith()` matcher asserts that the last promise returned by a spy function has resolved with a specific value.

### .toHaveNthResolvedWith()

The `.toHaveNthResolvedWith()` matcher asserts that the Nth promise returned by a spy function has resolved with a specific value.

### .toSatisfy()

The `.toSatisfy()` matcher asserts that a value satisfies a given predicate function. The predicate function should return `true` if the value is satisfactory, and `false` otherwise.

### .toThrow()

The `.toThrow()` matcher asserts that a function throws an error when called. You can also assert that the error message matches a specific string or regular expression.

### Static Matchers

Static matchers are accessed directly from the `expect` object and provide powerful, flexible ways to assert conditions in your tests. They are particularly useful when you don't need to assert an exact value, but rather that a value conforms to a certain type or structure.

#### `expect.anything`

The `expect.anything` special matcher matches any value that is not `null` or `undefined`. This is useful when you want to assert that a value was received, without caring about what the specific value is.

#### `expect.any(Constructor)`

The `expect.any(Constructor)` special matcher asserts that a value is an instance of the provided `Constructor` (e.g., `expect.any(Number)`, `expect.any(String)`, `expect.any(Array)`). This is useful for type-checking values without asserting their exact content.

## Fn API

The `fn` API provides utilities for working with functions, particularly in the context of mocking and spying. It allows you to create mock functions that can be tracked and configured for testing. This is essential for isolating units of code and controlling their behavior during tests.

### Creating a Mock Function

You can create a mock function by calling `fn()`. This creates a versatile spy that can track calls, define return values, and mock implementations. It can be used to test how other functions use it, ensuring that the correct arguments are passed and that it is called the expected number of times.

### Mock Function Properties

#### .mock.calls

The `.mock.calls` property is an array that stores the arguments for every call that has been made to the mock function. Each element in the array is itself an array of the arguments for a specific call. This is useful for inspecting the full history of calls to a function.

#### .mock.instances

The `.mock.instances` property is an array that stores the `this` value for each call to the mock function. This is particularly useful for testing constructor functions, as it allows you to inspect the objects that were created.

#### .mock.lastCall

The `.mock.lastCall` property is an array containing the arguments of the most recent call to the mock function. This is a convenient shortcut for when you only need to inspect the final call.

### Mock Function Configuration

#### .mockImplementationOnce()

The `.mockImplementationOnce()` method allows you to define a custom implementation for a mock function that will only be used for a single call. This is useful for testing functions that behave differently on subsequent calls.

#### .mockName()

The `.mockName()` method sets a custom name for your mock function. This name will be used in test error messages, making it easier to identify which mock function is failing.

#### .mockReturnThis()

The `.mockReturnThis()` method configures a mock function to return its own `this` context on every call. This is useful for chaining method calls in a fluent API style.

#### .mockReturnValue()

The `.mockReturnValue()` method sets a simple return value for a mock function. Every time the mock function is called, it will return this value.

#### .mockReturnValueOnce()

The `.mockReturnValueOnce()` method is similar to `.mockReturnValue()`, but it only applies to the next call to the mock function. This is useful for testing functions that return different values on subsequent calls.

#### .mockResolvedValue()

The `.mockResolvedValue()` method is used for mocking asynchronous functions. It returns a promise that will resolve with the given value.

#### .mockResolvedValueOnce()

The `.mockResolvedValueOnce()` method is the asynchronous equivalent of `.mockReturnValueOnce()`. It returns a promise that will resolve with the given value, but only for the next call.

#### .mockRejectedValue()

The `.mockRejectedValue()` method is used for testing error handling in asynchronous code. It returns a promise that will reject with the given error.

#### .mockRejectedValueOnce()

The `.mockRejectedValueOnce()` method is the asynchronous equivalent of `.mockImplementationOnce()` for rejected promises. It returns a promise that will reject with the given error, but only for the next call.

#### .withImplementation()

The `.withImplementation()` method allows you to temporarily change the implementation of a mock function for the duration of a callback. This is useful for testing different scenarios without having to create multiple mock functions.

## Mock API

The `mock` API allows you to create mock functions and modules for testing purposes. This helps in isolating the code under test and controlling its dependencies. By using mocks, you can simulate the behavior of complex objects and functions, making your tests more predictable and focused.

### Mock Modules

#### `createMockFromModule()`

The `createMockFromModule()` function creates a mock object from a module, automatically mocking all of its exports. This is useful for creating a baseline mock that you can then customize.

#### `mock()`

The `mock()` function allows you to replace a module with a custom mock implementation. This gives you full control over the behavior of the module, allowing you to define its exports and their behavior.

## SpyOn API

The `spyOn` API allows you to spy on existing object methods or properties without changing their implementation. This is useful for asserting that a method was called, how many times, and with what arguments, or to track property access. Unlike a full mock, a spy preserves the original functionality while still allowing you to track its usage.

### Spying on Methods

When you `spyOn` a method, the original method is still called, but you gain access to its call information. This allows you to verify that the method was called with the correct arguments and that it returned the expected value, without having to reimplement its logic.

### Spying on Getters

You can spy on property getters by passing `'get'` as the third argument to `spyOn`. This allows you to track when a property is accessed.

### Spying on Setters

You can spy on property setters by passing `'set'` as the third argument to `spyOn`. This allows you to track when a property is modified.

## Test API

The `test` API provides the core functionality for defining and running tests. It includes functions for grouping tests and setting up/tearing down test environments. The `test` function is the primary way to define a test case, and `describe` is used to group related tests into suites.

### Defining Tests

Tests are defined using the `test()` function. Each `test()` block represents a single test case, and it should contain one or more `expect` assertions to verify the behavior of your code. You can have multiple `test` blocks within a single file, and they will be run independently.

### Test Suites (`describe`)

The `describe` function is used to group related tests into a suite. This helps in organizing your test files and providing a clear structure. By grouping tests, you can also use `beforeEach` and `afterEach` hooks to set up and tear down state for each test in the suite.

## Match API

The `match` API provides advanced matching capabilities, often used with `expect` for more complex assertion scenarios. It allows for partial object matching, which is useful when you only need to verify a subset of an object's properties.

### .toMatch()

The `.toMatch()` matcher asserts that a string matches a regular expression or a substring. This is useful for validating string formats, such as URLs, email addresses, or any other pattern-based text.

### .toMatchObject()

The `.toMatchObject()` matcher asserts that an object matches a subset of the properties of another object. This is particularly useful when you want to check for the presence and value of specific keys in an object without needing to verify the entire object structure.
