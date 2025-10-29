import { js2jeon } from '../js2jeon'
import { jeon2js } from '../jeon2js'

// Test class declaration conversion
const classCode = `class Person {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return "Hello, " + this.name;
  }
}`

console.log('=== Class Declaration Conversion Demo ===')
console.log('Original JS:')
console.log(classCode)
console.log()

const jeon = js2jeon(classCode)
console.log('Converted to JEON:')
console.log(JSON.stringify(jeon, null, 2))
console.log()

const regeneratedCode = jeon2js(jeon)
console.log('Converted back to JS:')
console.log(regeneratedCode)
console.log()

// Test class expression conversion
const classExpressionCode = `const Animal = class {
  constructor(species) {
    this.species = species;
  }

  getType() {
    return this.species;
  }
}`

console.log('=== Class Expression Conversion Demo ===')
console.log('Original JS:')
console.log(classExpressionCode)
console.log()

const jeon2 = js2jeon(classExpressionCode)
console.log('Converted to JEON:')
console.log(JSON.stringify(jeon2, null, 2))
console.log()

const regeneratedCode2 = jeon2js(jeon2)
console.log('Converted back to JS:')
console.log(regeneratedCode2)