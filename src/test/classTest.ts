import { expect, test } from '@woby/chk'
import { jeon2js } from '../jeon2js'
import { js2jeon } from '../js2jeon'

test('Class Conversion Tests', () => {
  test('Simple class declaration conversion', () => {
    const simpleClassJS = `
class Person {
  constructor(name) {
    this.name = name;
  }
  
  greet() {
    return "Hello, " + this.name;
  }
}
`
    console.log('Original JS (simple class):')
    console.log(simpleClassJS)

    const simpleClassJEON = js2jeon(simpleClassJS)
    expect(simpleClassJEON).toBeDefined()
    expect(typeof simpleClassJEON).toBe('object')

    console.log('Converted to JEON:')
    console.log(JSON.stringify(simpleClassJEON, null, 2))

    const regeneratedSimpleClassJS = jeon2js(simpleClassJEON)
    expect(regeneratedSimpleClassJS).toBeDefined()
    expect(typeof regeneratedSimpleClassJS).toBe('string')

    console.log('Converted back to JS:')
    console.log(regeneratedSimpleClassJS)
  })

  test('Class assigned to a variable conversion', () => {
    const assignedClassJS = `
const Animal = class {
  constructor(species) {
    this.species = species;
  }
  
  getType() {
    return this.species;
  }
}
`
    console.log('Original JS (assigned class):')
    console.log(assignedClassJS)

    const assignedClassJEON = js2jeon(assignedClassJS)
    expect(assignedClassJEON).toBeDefined()
    expect(typeof assignedClassJEON).toBe('object')

    console.log('Converted to JEON:')
    console.log(JSON.stringify(assignedClassJEON, null, 2))

    const regeneratedAssignedClassJS = jeon2js(assignedClassJEON)
    expect(regeneratedAssignedClassJS).toBeDefined()
    expect(typeof regeneratedAssignedClassJS).toBe('string')

    console.log('Converted back to JS:')
    console.log(regeneratedAssignedClassJS)
  })

  test('Direct JEON class declaration conversion', () => {
    console.log('=== Testing Direct JEON Class Declaration ===')
    const directClassJEON = {
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
    console.log('Direct JEON class:')
    console.log(JSON.stringify(directClassJEON, null, 2))

    const directClassJS = jeon2js(directClassJEON)
    expect(directClassJS).toBeDefined()
    expect(typeof directClassJS).toBe('string')

    console.log('Converted to JS:')
    console.log(directClassJS)
  })

  test('Direct JEON assigned class conversion', () => {
    console.log('=== Testing Direct JEON Assigned Class ===')
    const directAssignedClassJEON = {
      "@@": {
        "Animal": {
          "class": {
            "constructor(species)": {
              "function(species)": [
                {
                  "=": [
                    {
                      ".": [
                        "@this",
                        "species"
                      ]
                    },
                    "@species"
                  ]
                }
              ]
            },
            "getType()": {
              "function()": [
                {
                  "return": {
                    ".": [
                      "@this",
                      "species"
                    ]
                  }
                }
              ]
            }
          }
        }
      }
    }
    console.log('Direct JEON assigned class:')
    console.log(JSON.stringify(directAssignedClassJEON, null, 2))

    const directAssignedClassJS = jeon2js(directAssignedClassJEON)
    expect(directAssignedClassJS).toBeDefined()
    expect(typeof directAssignedClassJS).toBe('string')

    console.log('Converted to JS:')
    console.log(directAssignedClassJS)
  })
})