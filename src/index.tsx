import { $, $$, render } from 'woby'
import { jeon2js } from './jeon2js'
import { js2jeon } from './js2jeon'
import JSON5 from 'json5'

const App = () => {
  const jeonInput = $(`{
  "function(a, b)": [
    { "return": { "+": ["@a", "@b"] } }
  ]
}`)
  const tsInput = $('function sum(a, b) {\n  return a + b;\n}')
  const tsOutput = $('')
  const jeonOutput = $('')
  const useJSON5 = $(false)

  const convertJeonToTs = () => {
    try {
      console.log('JSON5:', JSON5)
      console.log('typeof JSON5:', typeof JSON5)
      console.log('JSON5.stringify:', JSON5.stringify)
      console.log('JSON5.parse:', JSON5.parse)
      console.log('typeof JSON5.stringify:', typeof JSON5.stringify)
      console.log('typeof JSON5.parse:', typeof JSON5.parse)

      // Create a JSON-like interface for JSON5
      const JSON5Wrapper = {
        stringify: JSON5.stringify,
        parse: JSON5.parse,
        [Symbol.toStringTag]: 'JSON'
      }

      console.log('JSON5Wrapper created:', JSON5Wrapper)
      console.log('typeof JSON5Wrapper.parse:', typeof JSON5Wrapper.parse)
      console.log('typeof JSON5.parse:', typeof JSON5.parse)

      const jeon = useJSON5() ? JSON5.parse($$(jeonInput)) : JSON.parse($$(jeonInput))
      // Pass the JSON implementation to jeon2js
      const code = jeon2js(jeon, { json: useJSON5() ? JSON5Wrapper : JSON })
      tsOutput(code)
    } catch (error: any) {
      console.error('convertJeonToTs error:', error)
      tsOutput(`Error: ${error.message}`)
    }
  }

  const convertTsToJeon = () => {
    try {
      console.log('JSON5:', JSON5)
      console.log('typeof JSON5:', typeof JSON5)
      console.log('JSON5.stringify:', JSON5.stringify)
      console.log('JSON5.parse:', JSON5.parse)
      console.log('typeof JSON5.stringify:', typeof JSON5.stringify)
      console.log('typeof JSON5.parse:', typeof JSON5.parse)

      // Create a JSON-like interface for JSON5
      const JSON5Wrapper = {
        stringify: JSON5.stringify,
        parse: JSON5.parse,
        [Symbol.toStringTag]: 'JSON'
      }

      console.log('JSON5Wrapper created:', JSON5Wrapper)
      console.log('typeof JSON5Wrapper.stringify:', typeof JSON5Wrapper.stringify)
      console.log('typeof JSON5Wrapper.parse:', typeof JSON5Wrapper.parse)

      const jeon = js2jeon($$(tsInput) as string, { json: useJSON5() ? JSON5Wrapper : JSON })
      const formatted = useJSON5() ? JSON5Wrapper.stringify(jeon, null, 2) : JSON.stringify(jeon, null, 2)
      jeonOutput(formatted)
    } catch (error: any) {
      console.error('convertTsToJeon error:', error)
      jeonOutput(`Error: ${error.message}`)
    }
  }

  // Initialize with conversion
  convertJeonToTs()

  // Helper functions to display literal curly braces
  const jeonExample1 = '{ "function a(name)": [ { "return": { "+": ["Hello, ", "@name"] } } ] }'
  const tsExample1 = 'function a(name) { return ("Hello, " + name) }'
  const jeonExample2 = '{ "@": { "count": 0, "message": "Hello World" } }'
  const tsExample2 = 'let count = 0; let message = "Hello World"'
  const jeonExample3 = '{ "(x) =>": { "*": ["@x", 2] } }'
  const tsExample3 = '(x) => { return (x * 2); }'

  // New examples for enhanced features
  const jeonExample4 = `{
  "function* countUpTo(max)": [
    { "yield": 1 },
    { "yield": 2 },
    { "return": "@max" }
  ]
}`
  const tsExample4 = `function* countUpTo(max) {
  yield 1;
  yield 2;
  return max;
}`

  const jeonExample5 = `{
  "async function fetchData()": [
    {
      "@": {
        "response": {
          "await": {
            "fetch()": ["/api/data"]
          }
        }
      }
    },
    {
      "return": "@response"
    }
  ]
}`
  const tsExample5 = `async function fetchData() {
  const response = await fetch("/api/data");
  return response;
}`

  const jeonExample6 = `{
  "@": {
    "element": {
      "<div>": {
        "className": "container",
        "children": [
          {
            "<h1>": {
              "children": ["Hello World"]
            }
          }
        ]
      }
    }
  }
}`
  const tsExample6 = `let element = <div className="container">
  <h1>Hello World</h1>
</div>;`

  const jeonExample7 = `{
  "@": {
    "a": [
      1,
      2,
      {
        "...": [3, 4]
      },
      5
    ]
  }
}`
  const tsExample7 = `let a = [1, 2, ...[3, 4], 5];`

  // New example for class declaration
  const jeonExample8 = `{
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
}`
  const tsExample8 = `class Person {
  constructor(name) {
  this.name = name
};
  greet() {
  return ("Hello, " + this.name)
}
}`

  // New example for assigned class
  const jeonExample9 = `{
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
}`
  const tsExample9 = `const Animal = class {
  constructor(species) {
  this.species = species
};
  getType() {
  return this.species
}
}`

  // New example for object spread operator with JSON5
  const jeonExample10 = `{
  "@": {
    "a": {
      "1": 2,
      "2": 3,
      "...": {
        "3": 3,
        "4": 4
      },
      "5": 5
    }
  }
}`
  const tsExample10 = `let a = {1:2, 2:3, ...{3:3, 4:4}, 5:5};`

  return (
    <div class="max-w-6xl mx-auto p-5">
      <div class="bg-white rounded-lg shadow-lg p-6 my-6">
        <h1 class="text-3xl font-bold text-center text-gray-800 mb-4">JEON Converter Demo</h1>
        <p class="text-center text-gray-600 mb-8">A bidirectional converter between JEON (JSON-based Executable Object Notation) and TypeScript/JavaScript.</p>

        <div class="flex items-center mb-4">
          <input
            type="checkbox"
            id="useJSON5"
            checked={useJSON5()}
            onChange={(e: any) => useJSON5(e.target.checked)}
            class="mr-2"
          />
          <label for="useJSON5" class="text-gray-700">
            Use JSON5 (allows comments, trailing commas, etc.)
          </label>
        </div>

        <div class="flex flex-col md:flex-row gap-6 mb-8">
          <div class="flex-1 flex flex-col">
            <h2 class="text-xl font-semibold text-gray-800 mb-3">JEON to TypeScript</h2>
            <textarea
              value={jeonInput}
              onInput={(e: any) => jeonInput(e.target.value)}
              class="w-full h-80 font-mono text-sm p-3 border border-gray-300 rounded-md resize-y"
              placeholder="Enter JEON code here..."
            />
            <button
              onClick={convertJeonToTs}
              class="mt-3 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
            >
              Convert to TypeScript
            </button>
          </div>

          <div class="flex-1 flex flex-col">
            <h2 class="text-xl font-semibold text-gray-800 mb-3">TypeScript to JEON</h2>
            <textarea
              value={tsInput}
              onInput={(e: any) => tsInput(e.target.value)}
              class="w-full h-80 font-mono text-sm p-3 border border-gray-300 rounded-md resize-y"
              placeholder="Enter TypeScript code here..."
            />
            <button
              onClick={convertTsToJeon}
              class="mt-3 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
            >
              Convert to JEON
            </button>
          </div>
        </div>

        <div class="flex flex-col md:flex-row gap-6">
          <div class="flex-1 flex flex-col">
            <h2 class="text-xl font-semibold text-gray-800 mb-3">TypeScript Output</h2>
            <textarea
              value={tsOutput}
              readonly
              class="w-full h-80 font-mono text-sm p-3 border border-gray-300 rounded-md resize-y bg-gray-50"
              placeholder="TypeScript output will appear here..."
            />
          </div>

          <div class="flex-1 flex flex-col">
            <h2 class="text-xl font-semibold text-gray-800 mb-3">JEON Output</h2>
            <textarea
              value={jeonOutput}
              readonly
              class="w-full h-80 font-mono text-sm p-3 border border-gray-300 rounded-md resize-y bg-gray-50"
              placeholder="JEON output will appear here..."
            />
          </div>
        </div>

        <div class="mt-10">
          <h2 class="text-2xl font-bold text-gray-800 mb-5">Example Conversions</h2>

          <div class="mb-5 p-5 bg-gray-50 border-l-4 border-blue-500 rounded-r">
            <h3 class="text-lg font-semibold text-blue-600 mb-3">1. Function Declaration</h3>
            <p class="font-medium mb-2">JEON:</p>
            <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto">{jeonExample1}</pre>
            <p class="font-medium mb-2">TypeScript:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto">{tsExample1}</pre>
          </div>

          <div class="mb-5 p-5 bg-gray-50 border-l-4 border-blue-500 rounded-r">
            <h3 class="text-lg font-semibold text-blue-600 mb-3">2. Variable Declaration</h3>
            <p class="font-medium mb-2">JEON:</p>
            <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto">{jeonExample2}</pre>
            <p class="font-medium mb-2">TypeScript:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto">{tsExample2}</pre>
          </div>

          <div class="mb-5 p-5 bg-gray-50 border-l-4 border-blue-500 rounded-r">
            <h3 class="text-lg font-semibold text-blue-600 mb-3">3. Arrow Function</h3>
            <p class="font-medium mb-2">JEON:</p>
            <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto">{jeonExample3}</pre>
            <p class="font-medium mb-2">TypeScript:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto">{tsExample3}</pre>
          </div>

          <div class="mb-5 p-5 bg-gray-50 border-l-4 border-green-500 rounded-r">
            <h3 class="text-lg font-semibold text-green-600 mb-3">4. Generator Function</h3>
            <p class="font-medium mb-2">JEON:</p>
            <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto">{jeonExample4}</pre>
            <p class="font-medium mb-2">TypeScript:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto">{tsExample4}</pre>
          </div>

          <div class="mb-5 p-5 bg-gray-50 border-l-4 border-green-500 rounded-r">
            <h3 class="text-lg font-semibold text-green-600 mb-3">5. Async/Await</h3>
            <p class="font-medium mb-2">JEON:</p>
            <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto">{jeonExample5}</pre>
            <p class="font-medium mb-2">TypeScript:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto">{tsExample5}</pre>
          </div>

          <div class="mb-5 p-5 bg-gray-50 border-l-4 border-green-500 rounded-r">
            <h3 class="text-lg font-semibold text-green-600 mb-3">6. JSX Elements</h3>
            <p class="font-medium mb-2">JEON:</p>
            <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto">{jeonExample6}</pre>
            <p class="font-medium mb-2">TypeScript:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto">{tsExample6}</pre>
          </div>

          <div class="mb-5 p-5 bg-gray-50 border-l-4 border-green-500 rounded-r">
            <h3 class="text-lg font-semibold text-green-600 mb-3">7. Array Spread Operator</h3>
            <p class="font-medium mb-2">JEON:</p>
            <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto">{jeonExample7}</pre>
            <p class="font-medium mb-2">TypeScript:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto">{tsExample7}</pre>
          </div>

          <div class="mb-5 p-5 bg-gray-50 border-l-4 border-purple-500 rounded-r">
            <h3 class="text-lg font-semibold text-purple-600 mb-3">8. Class Declaration</h3>
            <p class="font-medium mb-2">JEON:</p>
            <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto">{jeonExample8}</pre>
            <p class="font-medium mb-2">TypeScript:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto">{tsExample8}</pre>
          </div>

          <div class="mb-5 p-5 bg-gray-50 border-l-4 border-purple-500 rounded-r">
            <h3 class="text-lg font-semibold text-purple-600 mb-3">9. Assigned Class</h3>
            <p class="font-medium mb-2">JEON:</p>
            <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto">{jeonExample9}</pre>
            <p class="font-medium mb-2">TypeScript:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto">{tsExample9}</pre>
          </div>

          <div class="p-5 bg-gray-50 border-l-4 border-yellow-500 rounded-r">
            <h3 class="text-lg font-semibold text-yellow-600 mb-3">10. Object Spread Operator (JSON5)</h3>
            <p class="font-medium mb-2">JEON:</p>
            <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto">{jeonExample10}</pre>
            <p class="font-medium mb-2">TypeScript:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto">{tsExample10}</pre>
            <p class="text-sm text-gray-600 mt-2">Note: This feature requires JSON5 support to be enabled</p>
          </div>
        </div>
      </div>
    </div>
  )
}

render(<App />, document.getElementById('app'))