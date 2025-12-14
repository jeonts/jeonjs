import { jeon2js } from '../jeon2js'
import { evalJeon } from '../safeEval'

console.log('=== Evaluating Generated Code ===')

// Test 1: Function declaration
console.log('\n1. Testing function declaration:')
const functionJeon = {
    'function greet(name)': {
        'return': { '+': ['Hello ', '@name'] }
    }
}

const functionCode = jeon2js(functionJeon)
console.log('Generated code:', functionCode)

// Evaluate the generated code
try {
    // Create a function that returns the generated function
    const func = new Function('evalJeon', 'Object', `return ${functionCode}`)(evalJeon, Object)
    // Now test the function
    const result = func('World')
    console.log('Function result:', result)
} catch (error) {
    console.error('Error evaluating function:', error)
}

// Test 2: Arrow function with parameters
console.log('\n2. Testing arrow function with parameters:')
const arrowFunctionJeon = {
    '(x) =>': {
        'return': { '+': ['Hello World ', '@x'] }
    }
}

const arrowCode = jeon2js(arrowFunctionJeon)
console.log('Generated code:', arrowCode)

// Evaluate the generated code
try {
    // Create a function that returns the generated arrow function
    const arrowFunc = new Function('evalJeon', 'Object', `return ${arrowCode}`)(evalJeon, Object)
    // Now test the function
    const result = arrowFunc('Test')
    console.log('Arrow function result:', result)
} catch (error) {
    console.error('Error evaluating arrow function:', error)
}

// Test 3: Class with methods and properties
console.log('\n3. Testing class with methods and properties:')
const classJeon = {
    'class Person': {
        'constructor(name)': {
            '=': [{ '.': ['@this', 'name'] }, '@name']
        },
        'get fullName()': {
            'return': { '.': ['@this', 'name'] }
        },
        'set fullName(value)': {
            '=': [{ '.': ['@this', 'name'] }, '@value']
        },
        'greet()': {
            'return': { '+': ['Hello, ', { '.': ['@this', 'name'] }] }
        }
    }
}

const classCode = jeon2js(classJeon)
console.log('Generated code:', classCode)

// Evaluate the generated class
try {
    // Create a function that returns the generated class
    const PersonClass = new Function('evalJeon', 'Object', `return ${classCode}`)(evalJeon, Object)
    // Now test the class
    const person = new PersonClass('John')
    console.log('Person name:', person.fullName)

    console.log('Before setting fullName, person.name:', person.name)
    person.fullName = 'Jane'
    console.log('After setting fullName to Jane, person.name:', person.name)
    console.log('Updated name:', person.fullName)

    const greeting = person.greet()
    console.log('Greeting:', greeting)
} catch (error) {
    console.error('Error evaluating class:', error)
}

// Test 4: Calculator class with add method
console.log('\n4. Testing Calculator class with add method:')
const calculatorJeon = {
    'class Calculator': {
        'add(a, b)': {
            'return': { '+': ['@a', '@b'] }
        }
    }
}

const calculatorCode = jeon2js(calculatorJeon)
console.log('Generated code:', calculatorCode)

// Evaluate the calculator class
try {
    // Create a function that returns the generated class
    const CalculatorClass = new Function('evalJeon', 'Object', `return ${calculatorCode}`)(evalJeon, Object)
    // Now test the calculator
    const calc = new CalculatorClass()
    const result = calc.add(5, 3)
    console.log('Calculator result:', result)
} catch (error) {
    console.error('Error evaluating calculator:', error)
}

// Test 5: Object literal with @@ operator and complex properties
console.log('\n5. Testing object literal with @@ operator and complex properties:')
const objectJeon = {
    '@@': {
        'config': {
            "name": "John",
            "age": {
                "() =>": {
                    "-": [
                        {
                            "()": [
                                {
                                    ".": [
                                        {
                                            "new": [
                                                "Date"
                                            ]
                                        },
                                        "getFullYear"
                                    ]
                                }
                            ]
                        },
                        2000
                    ]
                }
            },
            "active": true
        }
    }
}

const objectCode = jeon2js(objectJeon)
console.log('Generated code:', objectCode)

// Evaluate the object literal - we need to handle const declarations differently
try {
    // For const declarations, we need to wrap them in an IIFE or extract the value
    const wrappedCode = `(function() { ${objectCode}; return config; })()`
    const result = new Function('evalJeon', 'Object', `return ${wrappedCode}`)(evalJeon, Object)
    console.log('Object result:', result)
    console.log('Object name:', result.name)
    console.log('Object active:', result.active)

    // Test the age function
    if (typeof result.age === 'function') {
        const ageResult = result.age()
        console.log('Age function result:', ageResult)
    }
} catch (error) {
    console.error('Error evaluating object:', error)
}

// Test 6: Direct evalJeon evaluation
console.log('\n6. Testing direct evalJeon evaluation:')
try {
    // Test function body evaluation
    const functionBody = { "return": { "+": ["Hello ", "@name"] } }
    const functionContext = { name: "World" }
    const directResult = evalJeon(functionBody, functionContext)
    console.log('Direct function evaluation result:', directResult)

    // Test arrow function body evaluation
    const arrowBody = { "return": { "+": ["Hello World ", "@x"] } }
    const arrowContext = { x: "Test" }
    const arrowResult = evalJeon(arrowBody, arrowContext)
    console.log('Direct arrow function evaluation result:', arrowResult)

    // Test calculator add evaluation
    const addBody = { "return": { "+": ["@a", "@b"] } }
    const addContext = { a: 5, b: 3 }
    const addResult = evalJeon(addBody, addContext)
    console.log('Direct calculator evaluation result:', addResult)

    // Test class method evaluation with proper this context
    const greetBody = { "return": { "+": ["Hello, ", { ".": ["@this", "name"] }] } }
    const greetContext = { this: { name: "John" } }
    // We need to merge the this context with the context object for proper evaluation
    const mergedGreetContext = Object.assign({}, greetContext.this, { this: greetContext.this })
    const greetResult = evalJeon(greetBody, mergedGreetContext)
    console.log('Direct greet evaluation result:', greetResult)

    // Test getter evaluation with proper this context
    const getterBody = { "return": { ".": ["@this", "name"] } }
    const getterContext = { this: { name: "John" } }
    // We need to merge the this context with the context object for proper evaluation
    const mergedGetterContext = Object.assign({}, getterContext.this, { this: getterContext.this })
    const getterResult = evalJeon(getterBody, mergedGetterContext)
    console.log('Direct getter evaluation result:', getterResult)

    // Test setter evaluation with proper this context
    console.log('\nTesting setter evaluation:')
    const setterBody = { "=": [{ ".": ["@this", "name"] }, "@value"] }
    const setterContext = { this: { name: "John" }, value: "Jane" }
    // We need to merge the this context with the context object for proper evaluation
    const mergedSetterContext = Object.assign({}, setterContext.this, { this: setterContext.this }, { value: setterContext.value })
    console.log('Context before setter:', mergedSetterContext)
    const setterResult = evalJeon(setterBody, mergedSetterContext)
    console.log('Setter result:', setterResult)
    console.log('Context after setter:', mergedSetterContext)
    console.log('this.name after setter:', mergedSetterContext.this.name)
} catch (error) {
    console.error('Error in direct evaluation:', error)
}

console.log('\n=== All evaluation tests completed ===')