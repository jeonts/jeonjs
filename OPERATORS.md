# JEON Operator Documentation

This document provides detailed documentation for all JEON operators as defined in `JeonExpression.ts`, organized by categories that match the implementation structure in the `eval.jeon` folder.

## Table of Contents

1. [Arithmetic Operators](#arithmetic-operators)
2. [Comparison Operators](#comparison-operators)
3. [Logical Operators](#logical-operators)
4. [Bitwise Operators](#bitwise-operators)
5. [Bitwise Shift Operators](#bitwise-shift-operators)
6. [Unary Operators](#unary-operators)
7. [Assignment Operators](#assignment-operators)
8. [Compound Assignment Operators](#compound-assignment-operators)
9. [Increment/Decrement Operators](#incrementdecrement-operators)
10. [Control Flow Operators](#control-flow-operators)
11. [Function Operators](#function-operators)
12. [Function Declaration Operators](#function-declaration-operators)
13. [Object Operators](#object-operators)
14. [Array Operators](#array-operators)
15. [Special Operators](#special-operators)
16. [New Operator](#new-operator)
17. [Sequence Operator](#sequence-operator)
18. [Await Operator](#await-operator)
19. [Comment Operators](#comment-operators)

## Arithmetic Operators

These operators perform mathematical calculations.

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `+` | `{"+": [operand1, operand2, ...]}` | Array of 2+ operands | `a + b + c` | `{"+": [1, 2, 3]}` |
| `-` | `{"-": [operand1, operand2, ...]}` | Array of 2+ operands | `a - b - c` | `{"-": [10, 3, 2]}` |
| `*` | `{"*": [operand1, operand2, ...]}` | Array of 2+ operands | `a * b * c` | `{"*": [2, 3, 4]}` |
| `/` | `{"/": [operand1, operand2, ...]}` | Array of 2+ operands | `a / b / c` | `{"/": [24, 2, 3]}` |
| `%` | `{"%": [operand1, operand2]}` | Array of 2 operands | `a % b` | `{"%": [10, 3]}` |

Additionally, unary forms are supported:
| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| Unary `+` | `{"+": operand}` | Single operand | `+a` | `{"+": "@value"}` |
| Unary `-` | `{"-": operand}` | Single operand | `-a` | `{"-": "@value"}` |

Implementation file: `src/eval.jeon/arithmeticOperators.ts`

## Comparison Operators

These operators compare values and return boolean results.

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

Implementation file: `src/eval.jeon/comparisonOperators.ts`

## Logical Operators

These operators perform logical operations.

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `&&` | `{"&&": [operand1, operand2, ...]}` | Array of 2+ operands | `a && b && c` | `{"&&": ["@a", "@b", "@c"]}` |
| `||` | `{"||": [operand1, operand2, ...]}` | Array of 2+ operands | `a || b || c` | `{"||": ["@a", "@b", "@c"]}` |
| `!` | `{"!": operand}` | Single operand | `!a` | `{"!": "@condition"}` |

Implementation file: `src/eval.jeon/logicalOperators.ts`

## Bitwise Operators

These operators perform bitwise operations on integers.

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `~` | `{"~": operand}` | Single operand | `~a` | `{"~": "@value"}` |
| `&` | `{"&": [operand1, operand2]}` | Array of 2 operands | `a & b` | `{"&": [5, 3]}` |
| `|` | `{"|": [operand1, operand2]}` | Array of 2 operands | `a | b` | `{"|": [5, 3]}` |
| `^` | `{"^": [operand1, operand2]}` | Array of 2 operands | `a ^ b` | `{"^": [5, 3]}` |

Implementation file: `src/eval.jeon/bitwiseOperators.ts`

## Bitwise Shift Operators

These operators perform bitwise shift operations.

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `<<` | `{"<<": [operand1, operand2]}` | Array of 2 operands | `a << b` | `{"<<": [5, 2]}` |
| `>>` | `{">>": [operand1, operand2]}` | Array of 2 operands | `a >> b` | `{">>": [5, 2]}` |
| `>>>` | `{">>>": [operand1, operand2]}` | Array of 2 operands | `a >>> b` | `{">>>": [5, 2]}` |

Implementation file: `src/eval.jeon/bitwiseShiftOperators.ts`

## Unary Operators

Basic unary operators.

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `!` | `{"!": operand}` | Single operand | `!a` | `{"!": "@condition"}` |
| `~` | `{"~": operand}` | Single operand | `~a` | `{"~": "@value"}` |

Implementation file: `src/eval.jeon/unaryOperators.ts`

## Extended Unary Operators

Additional unary operators.

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `typeof` | `{"typeof": operand}` | Single operand | `typeof a` | `{"typeof": "@value"}` |
| `void` | `{"void": operand}` | Single operand | `void a` | `{"void": "@value"}` |
| `delete` | `{"delete": operand}` | Single operand | `delete a` | `{"delete": "@value"}` |

Implementation file: `src/eval.jeon/unaryExtendedOperators.ts`

## Assignment Operators

These operators assign values to variables or properties.

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `=` | `{"=": [target, value]}` | Array of 2 operands | `a = b` | `{"=": ["@a", 5]}` |

Implementation file: `src/eval.jeon/assignmentOperators.ts`

## Compound Assignment Operators

These operators perform an operation and assignment in one step.

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
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

Implementation file: `src/eval.jeon/assignmentCompoundOperators.ts`

## Increment/Decrement Operators

These operators increase or decrease values by 1.

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `++` | `{"++": operand}` | Single operand | `++a` | `{"++": "@counter"}` |
| `--` | `{"--": operand}` | Single operand | `--a` | `{"--": "@counter"}` |
| `++.` | `{"++.": operand}` | Single operand | `a++` | `{"++.": "@counter"}` |
| `--.` | `{"--.": operand}` | Single operand | `a--` | `{"--.": "@counter"}` |

Implementation file: `src/eval.jeon/incrementDecrementOperators.ts`

## Control Flow Operators

These operators control the flow of execution.

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `if` | `{"if": [condition, trueBlock, falseBlock]}` | Array of 2-3 operands | `if (condition) { trueBlock } else { falseBlock }` | `{"if": ["@condition", "doThis()", "doThat()"]}` |
| `while` | `{"while": [condition, body]}` | Array of 2 operands | `while (condition) { body }` | `{"while": ["@condition", "doThis()"]}` |
| `for` | `{"for": [init, condition, increment, body]}` | Array of 4 operands | `for (init; condition; increment) { body }` | `{"for": ["@i = 0", "@i < 10", "@i++", "doThis()"]}` |

Implementation file: `src/eval.jeon/controlFlowOperators.ts`

## Function Operators

Operators related to function execution.

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `()` | `{"()": [function, arg1, arg2, ...]}` | Array with function reference and arguments | `func(a, b)` | `{"()": ["@func", "@a", "@b"]}` |

Implementation file: `src/eval.jeon/functionOperators.ts`

## Function Declaration Operators

Operators for declaring functions.

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `function` | `{"function(param1, param2, ...)": [body]}` | Array of statements | `function name(param1, param2) { body }` | `{"function(a, b)": [{"return": {"+": ["@a", "@b"]}}]}` |
| `async function` | `{"async function(param1, param2, ...)": [body]}` | Array of statements | `async function name(param1, param2) { body }` | `{"async function()": [{"await": {"fetch()": ["/api"]}}]}` |
| `function*` | `{"function*(param1, param2, ...)": [body]}` | Array of statements | `function* name(param1, param2) { body }` | `{"function*()": [{"yield": 1}]}` |
| `=>` | `{"(param1, param2, ...) =>": body}` | Expression or array of statements | `(param1, param2) => body` | `{"(a, b) =>": {"+": ["@a", "@b"]}}` |
| `()=>` | `{"()=>": expression}` | Expression | `() => expression` | `{"()=>": 42}` |

Implementation file: `src/eval.jeon/functionDeclarationOperators.ts`

## Object Operators

Operators for working with objects.

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `.` | `{"." [object, property1, property2, ...]}` | Array with object and property chain | `obj.prop1.prop2` | `{"." ["@obj", "prop1", "prop2"]}` |

Implementation file: `src/eval.jeon/objectOperators.ts`

## Array Operators

Operators for working with arrays.

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `,` | `{",": [item1, item2, ...]}` | Array of items | `item1, item2, ...` | `{"+": [1, 2, 3]}` |

Implementation file: `src/eval.jeon/arrayOperators.ts`

## Special Operators

Various special-purpose operators.

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `?` | `{"?": [condition, trueValue, falseValue]}` | Array of 3 operands | `condition ? trueValue : falseValue` | `{"?": ["@isValid", "valid", "invalid"]}` |
| `(` | `{"(": expression}` | Single operand | `(expression)` | `{"(": {"+": [1, 2]}}` |
| `...` | `{"...": expression}` | Single operand | `...expression` | `{"...": [1, 2, 3]}` |
| `return` | `{"return": expression}` | Single operand | `return expression` | `{"return": "@value"}` |
| `yield` | `{"yield": expression}` | Single operand | `yield expression` | `{"yield": "@value"}` |
| `yield*` | `{"yield*": expression}` | Single operand | `yield* expression` | `{"yield*": [1, 2, 3]}` |

Implementation file: `src/eval.jeon/specialOperators.ts`

## New Operator

Operator for creating instances.

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `new` | `{"new": [constructor, arg1, arg2, ...]}` | Array with constructor and arguments | `new Class(a, b)` | `{"new": ["Date", 0]}` |

Implementation file: `src/eval.jeon/newOperator.ts`

## Sequence Operator

Operator for sequencing expressions.

Implementation file: `src/eval.jeon/sequenceOperator.ts`

## Await Operator

Operator for handling promises in async functions.

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `await` | `{"await": expression}` | Single operand | `await expression` | `{"await": {"fetch()": ["/api"]}}` |

Implementation file: `src/eval.jeon/awaitOperator.ts`

## Comment Operators

Operators for representing comments.

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `//` | `{"//": commentText}` | Single operand | `// commentText` | `{"//": "This is a comment"}` |
| `/*` | `{"/*": commentText}` | Array of strings or single string | `/* commentText */` | `{"/*": ["This is a", "multiline comment"]}` |
| `/ /` | `{"/ /": { pattern: string, flags: string }}` | Object with pattern and flags | `/pattern/flags` | `{"/ /": { "pattern": "abc", "flags": "gi" }}` |
Implementation file: `src/eval.jeon/commentOperators.ts`
## Class Operators

Operators for defining and working with classes.

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `class` | `{"class ClassName": { ... }}` | Object (Class Configuration) | `class ClassName { ... }` | `{"class Person": { "constructor(name)": { "function(name)": [...] } }}` |
| `extends` | `{"extends": ParentClass}` | Parent class reference | `class Child extends Parent` | Used within class definition |
| `static` | `{"static": value}` | Static property/method value | `static propertyName` | Used within class definition |

## Variable Declaration Operators

Operators for declaring variables.

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `@` | `{"@": { variableName: initialValue }}` | Object (Name/Value map) | `let variableName = initialValue` | `{"@": { "x": 5 }}` |
| `@@` | `{"@@": { constantName: initialValue }}` | Object (Name/Value map) | `const constantName = initialValue` | `{"@@": { "PI": 3.14159 }}` |

## Additional Control Flow Operators

Additional operators for controlling the flow of execution.

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `do` | `{"do": [body, condition]}` | Array of 2 operands | `do { body } while (condition)` | `{"do": ["doThis()", "@condition"]}` |
| `break` | `{"break": label}` | Optional string | `break label` | `{"break": "loop1"}` or `{"break": null}` |
| `continue` | `{"continue": label}` | Optional string | `continue label` | `{"continue": "loop1"}` or `{"continue": null}` |
| `switch` | `{"switch": [expression, cases, default]}` | Array of 3 operands | `switch (expression) { cases }` | Complex structure |
| `case` | `{"case": value}` | Case value | `case value:` | Used within switch cases |
| `default` | `{"default": body}` | Default case body | `default: body` | Used within switch statement |

## Instance Reference Operators

Special operators for referencing instance properties.

| Operator | JEON Structure | Operands | JavaScript Equivalent | Example |
|----------|----------------|----------|----------------------|---------|
| `@this` | Special reference | N/A | `this` | `["@this"]` |
| `@super` | Special reference | N/A | `super` | `["@super"]` |
| `@void` | Special reference | N/A | `void` | `["@void"]}` |
| `@undefined` | Special reference | N/A | `undefined` | `["@undefined"]` |
