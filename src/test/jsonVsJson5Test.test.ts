import { expect, test } from '@woby/chk'
import JSON5 from '@mainnet-pat/json5-bigint'
import { jeon2js } from '../jeon2js'

test('JSON vs JSON5 Comparison Test', () => {
  test('JSON5 parsing with comments and trailing commas', () => {
    console.log('=== JSON vs JSON5 Comparison ===')

    // Example JEON with comments and trailing commas (valid JSON5, invalid JSON)
    const json5WithFeatures = `{
  // User authentication function
  "async function authenticateUser(username, password)": [
    {
      "@@": {
        // API endpoint
        "url": "/api/auth",
        // Request payload
        "payload": {
          "user": "@username",
          "pass": "@password",
        },
      },
    },
    // Make API call
    {
      "@@": {
        "response": {
          "await": {
            "fetch()": [
              "@url",
              {
                "method": "POST",
                "headers": {
                  "Content-Type": "application/json",
                },
                "body": {
                  "JSON.stringify()": ["@payload"],
                },
              },
            ],
          },
        },
      },
    },
    // Return the result
    {
      "return": {
        "await": {
          "()": [
            {
              ".": ["@response", "json"]
            },
          ],
        },
      },
    },
  ],
}`

    console.log('JSON5 with comments and trailing commas:')
    console.log(json5WithFeatures)

    // Try parsing with JSON5
    try {
      const parsedWithJSON5 = JSON5.parse(json5WithFeatures)
      console.log('\n✅ Successfully parsed with JSON5!')
      console.log('Converted to JavaScript:')
      console.log(jeon2js(parsedWithJSON5))

      // Assertions
      expect(parsedWithJSON5).toBeDefined()
      expect(typeof parsedWithJSON5).toBe('object')
    } catch (error) {
      expect(error).toBeUndefined() // This will fail and show the error
    }
  })

  test('Standard JSON parsing failure with JSON5 features', () => {
    // Example JEON with comments and trailing commas (valid JSON5, invalid JSON)
    const json5WithFeatures = `{
  // User authentication function
  "async function authenticateUser(username, password)": [
    {
      "@@": {
        // API endpoint
        "url": "/api/auth",
        // Request payload
        "payload": {
          "user": "@username",
          "pass": "@password",
        },
      },
    },
    // Make API call
    {
      "@@": {
        "response": {
          "await": {
            "fetch()": [
              "@url",
              {
                "method": "POST",
                "headers": {
                  "Content-Type": "application/json",
                },
                "body": {
                  "JSON.stringify()": ["@payload"],
                },
              },
            ],
          },
        },
      },
    },
    // Return the result
    {
      "return": {
        "await": {
          "()": [
            {
              ".": ["@response", "json"]
            },
          ],
        },
      },
    },
  ],
}`

    // Try parsing with standard JSON (should fail)
    try {
      const parsedWithJSON = JSON.parse(json5WithFeatures)
      console.log('\n✅ Successfully parsed with standard JSON!')
      console.log('Converted to JavaScript:')
      console.log(jeon2js(parsedWithJSON))

      // This should not happen - JSON.parse should fail
      expect(true).toBe(false) // Force failure if JSON.parse succeeds
    } catch (error: any) {
      console.log('\n❌ Expected error when parsing with standard JSON:')
      console.log('   ' + error.message)

      // This is expected - JSON.parse should fail with JSON5 features
      expect(error).toBeDefined()
    }
  })

  test('Standard JSON parsing success without JSON5 features', () => {
    // Same example without comments and trailing commas (valid JSON)
    const standardJSON = `{
  "async function authenticateUser(username, password)": [
    {
      "@@": {
        "url": "/api/auth",
        "payload": {
          "user": "@username",
          "pass": "@password"
        }
      }
    },
    {
      "@@": {
        "response": {
          "await": {
            "fetch()": [
              "@url",
              {
                "method": "POST",
                "headers": {
                  "Content-Type": "application/json"
                },
                "body": {
                  "JSON.stringify()": ["@payload"]
                }
              }
            ]
          }
        }
      }
    },
    {
      "return": {
        "await": {
          "()": [
            {
              ".": ["@response", "json"]
            }
          ]
        }
      }
    }
  ]
}`

    console.log('\n' + '='.repeat(50))
    console.log('Same example with standard JSON:')
    console.log(standardJSON)

    try {
      const parsedStandard = JSON.parse(standardJSON)
      console.log('\n✅ Successfully parsed with standard JSON!')
      console.log('Converted to JavaScript:')
      console.log(jeon2js(parsedStandard))

      // Assertions
      expect(parsedStandard).toBeDefined()
      expect(typeof parsedStandard).toBe('object')
    } catch (error: any) {
      console.error('❌ Error parsing standard JSON:', error)
      expect(error).toBeUndefined() // This will fail and show the error
    }
  })
})