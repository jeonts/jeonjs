// Consolidated Class Tests
// This file consolidates similar class test cases from classTest.test.ts and other class-related tests
import { expect, test } from '@woby/chk'
import { jeon2js } from '../jeon2js'
import { js2jeon } from '../js2jeon'
import { normalizeJs } from './testUtils'

// Test cases for class conversions
const classTestCases = [
    {
        name: 'Simple class declaration',
        code: `
class Person {
  constructor(name) {
    this.name = name;
  }
  
  greet() {
    return "Hello, " + this.name;
  }
}
`,
        expectedElements: [
            'class Person',
            'constructor(name)',
            'this.name = name',
            'greet()',
            'return "Hello, " + this.name'
        ]
    },
    {
        name: 'Class assigned to a variable',
        code: `
const Animal = class {
  constructor(species) {
    this.species = species;
  }
  
  getType() {
    return this.species;
  }
}
`,
        expectedElements: [
            'const Animal = class',
            'constructor(species)',
            'this.species = species',
            'getType()',
            'return this.species'
        ]
    }
]

test('Class Conversion Tests', () => {
    classTestCases.forEach(({ name, code, expectedElements }) => {
        test(`${name} conversion`, () => {
            console.log(`Original JS (${name}):`)
            console.log(code)

            const jeon = js2jeon(code)
            expect(jeon).toBeDefined()
            expect(typeof jeon).toBe('object')

            console.log('Converted to JEON:')
            console.log(JSON.stringify(jeon, null, 2))

            const regeneratedJS = jeon2js(jeon)
            expect(regeneratedJS).toBeDefined()
            expect(typeof regeneratedJS).toBe('string')

            console.log('Converted back to JS:')
            console.log(regeneratedJS)

            // Check for expected elements
            expectedElements.forEach(element => {
                expect(regeneratedJS).toContain(element)
            })
        })
    })
})

// Test cases for direct JEON class declarations
const directClassTestCases = [
    {
        name: 'Direct JEON class declaration',
        jeon: {
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
        },
        expectedElements: [
            'class Person',
            'constructor(name)',
            'this.name = name',
            'greet()',
            'return "Hello, " + this.name'
        ]
    },
    {
        name: 'Direct JEON assigned class',
        jeon: {
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
        },
        expectedElements: [
            'const Animal = class',
            'constructor(species)',
            'this.species = species',
            'getType()',
            'return this.species'
        ]
    }
]

test('Direct JEON Class Declaration Tests', () => {
    directClassTestCases.forEach(({ name, jeon, expectedElements }) => {
        test(`${name} conversion`, () => {
            console.log(`Direct JEON ${name}:`)
            console.log(JSON.stringify(jeon, null, 2))

            // Cast to any to avoid type issues
            const js = jeon2js(jeon as any)
            expect(js).toBeDefined()
            expect(typeof js).toBe('string')

            console.log('Converted to JS:')
            console.log(js)

            // Check for expected elements
            expectedElements.forEach(element => {
                expect(js).toContain(element)
            })
        })
    })
})

// Round-trip conversion test
test('Class Round-trip Conversion Test', () => {
    test('Round-trip conversion with key element comparison', () => {
        const originalClassJS = `
class Person {
  constructor(name) {
    this.name = name;
  }
  
  greet() {
    return "Hello, " + this.name;
  }
}
`
        const expectedElements = [
            'class Person',
            'constructor(name)',
            'this.name = name',
            'greet()',
            'return "Hello, " + this.name'
        ]

        console.log('=== Round-trip Test ===')
        console.log('Original JS:')
        console.log(originalClassJS)

        // Convert JS to JEON
        const jeon = js2jeon(originalClassJS)
        expect(jeon).toBeDefined()
        expect(typeof jeon).toBe('object')

        console.log('\nJEON:')
        console.log(JSON.stringify(jeon, null, 2))

        // Convert JEON back to JS
        const regeneratedJS = jeon2js(jeon)
        expect(regeneratedJS).toBeDefined()
        expect(typeof regeneratedJS).toBe('string')

        console.log('\nRegenerated JS:')
        console.log(regeneratedJS)

        // Check for key elements in the regenerated code
        expectedElements.forEach(element => {
            expect(regeneratedJS).toContain(element)
        })

        console.log('\n✅ Round-trip conversion with key element comparison PASSED')
    })
})

console.log('🎉 All consolidated class tests completed!')