import './index.css'
import { $, $$, render, useEffect } from 'woby'
import { jeon2js } from './jeon2js'
import { js2jeon } from './js2jeon'
import JSON5 from 'json5'
// Import PrismJS for syntax highlighting
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'
// Import language components for syntax highlighting
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-json'

// Add CSS for collapsible functionality and editable divs
const customCSS = `
.collapsible-code {
    margin: 1rem 0;
}

.collapsible-btn {
    background: none;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    text-align: left;
    width: 100%;
    border-radius: 0.5rem;
}

.collapsible-btn:hover {
    background-color: #f3f4f6;
}

.collapsible-content {
    margin-top: 0.5rem;
}

.collapsible-content.show {
    display: block;
}

.collapsible-content.hidden {
    display: none;
}

/* Styles for editable divs to look like textareas */
.editable-div {
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    padding: 0.75rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: 0.875rem;
    resize: vertical;
    overflow: auto;
    background-color: white;
    min-height: 200px;
    outline: none;
    white-space: pre;
}

.editable-div:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.output-div {
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    padding: 0.75rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: 0.875rem;
    resize: vertical;
    overflow: auto;
    background-color: #f9fafb;
    min-height: 200px;
    white-space: pre;
}
`

// Inject CSS into the document
const style = document.createElement('style')
style.textContent = customCSS
document.head.appendChild(style)

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

  // Function to highlight code blocks with PrismJS
  const highlightCodeBlocks = () => {
    // Use setTimeout to ensure DOM is updated before highlighting
    setTimeout(() => {
      Prism.highlightAll()
      // Initialize collapsible functionality after Prism highlighting
    }, 0)
  }

  // Function to handle input changes with syntax highlighting
  const handleJeonInput = (e: any) => {
    const value = e.target.textContent || e.target.innerText
    jeonInput(value)
  }

  const handleTsInput = (e: any) => {
    const value = e.target.textContent || e.target.innerText
    tsInput(value)
  }

  // Update highlighting when outputs change
  const updateOutputHighlighting = () => {
    setTimeout(() => {
      const tsElement = document.getElementById('ts-output-code')
      if (tsElement && $$(tsOutput)) {
        try {
          tsElement.innerHTML = Prism.highlight($$(tsOutput), Prism.languages.typescript, 'typescript')
        } catch (e) {
          // Fallback to plain text if highlighting fails
          tsElement.textContent = $$(tsOutput)
        }
      }

      const jeonElement = document.getElementById('jeon-output-code')
      if (jeonElement && $$(jeonOutput)) {
        try {
          // Try to parse as JSON first for better formatting
          const parsed = JSON.parse($$(jeonOutput))
          const formatted = JSON.stringify(parsed, null, 2)
          jeonElement.innerHTML = Prism.highlight(formatted, Prism.languages.json, 'json')
        } catch {
          // If not valid JSON, highlight as plain text
          try {
            jeonElement.innerHTML = Prism.highlight($$(jeonOutput), Prism.languages.json, 'json')
          } catch (e) {
            // Fallback to plain text if highlighting fails
            jeonElement.textContent = $$(jeonOutput)
          }
        }
      }
    }, 0)
  }

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
      // Highlight code blocks after conversion
      highlightCodeBlocks()
      updateOutputHighlighting()
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
      // Highlight code blocks after conversion
      highlightCodeBlocks()
      updateOutputHighlighting()
    } catch (error: any) {
      console.error('convertTsToJeon error:', error)
      jeonOutput(`Error: ${error.message}`)
    }
  }

  // Initialize with conversion and highlighting
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
    <div class="max-w-6xl mx-auto p-5 bg-gray-800 text-white">
      <div class="bg-white rounded-lg shadow-lg p-6 my-6 text-gray-800">
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
            <pre
              id="jeon-input"
              contentEditable
              onInput={handleJeonInput}
              class="w-full h-80 font-mono text-sm p-3 border border-gray-300 rounded-md resize-y text-gray-800 overflow-auto bg-white editable-div"
            >{$$(jeonInput)}</pre>
            <button
              onClick={convertJeonToTs}
              class="mt-3 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
            >
              Convert to TypeScript
            </button>
          </div>

          <div class="flex-1 flex flex-col">
            <h2 class="text-xl font-semibold text-gray-800 mb-3">TypeScript to JEON</h2>
            <pre
              id="ts-input"
              contentEditable
              onInput={handleTsInput}
              class="w-full h-80 font-mono text-sm p-3 border border-gray-300 rounded-md resize-y text-gray-800 overflow-auto bg-white editable-div"
            >{$$(tsInput)}</pre>
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
            <pre
              id="ts-output"
              class="w-full h-80 font-mono text-sm p-3 border border-gray-300 rounded-md resize-y bg-gray-50 text-gray-800 overflow-auto output-div"
            ><code id="ts-output-code">{$$(tsOutput)}</code></pre>
          </div>

          <div class="flex-1 flex flex-col">
            <h2 class="text-xl font-semibold text-gray-800 mb-3">JEON Output</h2>
            <pre
              id="jeon-output"
              class="w-full h-80 font-mono text-sm p-3 border border-gray-300 rounded-md resize-y bg-gray-50 text-gray-800 overflow-auto output-div"
            ><code id="jeon-output-code">{$$(jeonOutput)}</code></pre>
          </div>
        </div>

        <div class="mt-10">
          <h2 class="text-2xl font-bold text-gray-800 mb-5">Example Conversions</h2>

          <div class="mb-5 p-5 bg-gray-50 border-l-4 border-blue-500 rounded-r">
            <h3 class="text-lg font-semibold text-blue-600 mb-3">1. Function Declaration</h3>
            <p class="font-medium mb-2">JEON:</p>
            <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto language-json"><code class="language-json">{jeonExample1}</code></pre>
            <p class="font-medium mb-2">TypeScript:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto language-typescript"><code class="language-typescript">{tsExample1}</code></pre>
          </div>

          <div class="mb-5 p-5 bg-gray-50 border-l-4 border-blue-500 rounded-r">
            <h3 class="text-lg font-semibold text-blue-600 mb-3">2. Variable Declaration</h3>
            <p class="font-medium mb-2">JEON:</p>
            <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto language-json"><code class="language-json">{jeonExample2}</code></pre>
            <p class="font-medium mb-2">TypeScript:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto language-typescript"><code class="language-typescript">{tsExample2}</code></pre>
          </div>

          <div class="mb-5 p-5 bg-gray-50 border-l-4 border-blue-500 rounded-r">
            <h3 class="text-lg font-semibold text-blue-600 mb-3">3. Arrow Function</h3>
            <p class="font-medium mb-2">JEON:</p>
            <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto language-json"><code class="language-json">{jeonExample3}</code></pre>
            <p class="font-medium mb-2">TypeScript:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto language-typescript"><code class="language-typescript">{tsExample3}</code></pre>
          </div>

          <div class="mb-5 p-5 bg-gray-50 border-l-4 border-green-500 rounded-r">
            <h3 class="text-lg font-semibold text-green-600 mb-3">4. Generator Function</h3>
            <p class="font-medium mb-2">JEON:</p>
            <div class="collapsible-code">
              <button class="collapsible-btn text-blue-600 hover:text-blue-800 font-medium flex items-center">
                <span class="mr-2">▼</span> Show JEON
              </button>
              <div class="collapsible-content hidden">
                <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto language-json"><code class="language-json">{jeonExample4}</code></pre>
              </div>
            </div>
            <p class="font-medium mb-2">TypeScript:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto language-typescript"><code class="language-typescript">{tsExample4}</code></pre>
          </div>

          <div class="mb-5 p-5 bg-gray-50 border-l-4 border-green-500 rounded-r">
            <h3 class="text-lg font-semibold text-green-600 mb-3">5. Async/Await</h3>
            <p class="font-medium mb-2">JEON:</p>
            <div class="collapsible-code">
              <button class="collapsible-btn text-blue-600 hover:text-blue-800 font-medium flex items-center">
                <span class="mr-2">▼</span> Show JEON
              </button>
              <div class="collapsible-content hidden">
                <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto language-json"><code class="language-json">{jeonExample5}</code></pre>
              </div>
            </div>
            <p class="font-medium mb-2">TypeScript:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto language-typescript"><code class="language-typescript">{tsExample5}</code></pre>
          </div>

          <div class="mb-5 p-5 bg-gray-50 border-l-4 border-green-500 rounded-r">
            <h3 class="text-lg font-semibold text-green-600 mb-3">6. JSX Elements</h3>
            <p class="font-medium mb-2">JEON:</p>
            <div class="collapsible-code">
              <button class="collapsible-btn text-blue-600 hover:text-blue-800 font-medium flex items-center">
                <span class="mr-2">▼</span> Show JEON
              </button>
              <div class="collapsible-content hidden">
                <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto language-json"><code class="language-json">{jeonExample6}</code></pre>
              </div>
            </div>
            <p class="font-medium mb-2">TypeScript:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto language-typescript"><code class="language-typescript">{tsExample6}</code></pre>
          </div>

          <div class="mb-5 p-5 bg-gray-50 border-l-4 border-green-500 rounded-r">
            <h3 class="text-lg font-semibold text-green-600 mb-3">7. Array Spread Operator</h3>
            <p class="font-medium mb-2">JEON:</p>
            <div class="collapsible-code">
              <button class="collapsible-btn text-blue-600 hover:text-blue-800 font-medium flex items-center">
                <span class="mr-2">▼</span> Show JEON
              </button>
              <div class="collapsible-content hidden">
                <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto language-json"><code class="language-json">{jeonExample7}</code></pre>
              </div>
            </div>
            <p class="font-medium mb-2">TypeScript:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto language-typescript"><code class="language-typescript">{tsExample7}</code></pre>
          </div>

          <div class="mb-5 p-5 bg-gray-50 border-l-4 border-purple-500 rounded-r">
            <h3 class="text-lg font-semibold text-purple-600 mb-3">8. Class Declaration</h3>
            <p class="font-medium mb-2">JEON:</p>
            <div class="collapsible-code">
              <button class="collapsible-btn text-blue-600 hover:text-blue-800 font-medium flex items-center">
                <span class="mr-2">▼</span> Show JEON
              </button>
              <div class="collapsible-content hidden">
                <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto language-json"><code class="language-json">{jeonExample8}</code></pre>
              </div>
            </div>
            <p class="font-medium mb-2">TypeScript:</p>
            <div class="collapsible-code">
              <button class="collapsible-btn text-blue-600 hover:text-blue-800 font-medium flex items-center">
                <span class="mr-2">▼</span> Show TypeScript
              </button>
              <div class="collapsible-content hidden">
                <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto language-typescript"><code class="language-typescript">{tsExample8}</code></pre>
              </div>
            </div>
          </div>

          <div class="mb-5 p-5 bg-gray-50 border-l-4 border-purple-500 rounded-r">
            <h3 class="text-lg font-semibold text-purple-600 mb-3">9. Assigned Class</h3>
            <p class="font-medium mb-2">JEON:</p>
            <div class="collapsible-code">
              <button class="collapsible-btn text-blue-600 hover:text-blue-800 font-medium flex items-center">
                <span class="mr-2">▼</span> Show JEON
              </button>
              <div class="collapsible-content hidden">
                <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto language-json"><code class="language-json">{jeonExample9}</code></pre>
              </div>
            </div>
            <p class="font-medium mb-2">TypeScript:</p>
            <div class="collapsible-code">
              <button class="collapsible-btn text-blue-600 hover:text-blue-800 font-medium flex items-center">
                <span class="mr-2">▼</span> Show TypeScript
              </button>
              <div class="collapsible-content hidden">
                <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto language-typescript"><code class="language-typescript">{tsExample9}</code></pre>
              </div>
            </div>
          </div>

          <div class="p-5 bg-gray-50 border-l-4 border-yellow-500 rounded-r">
            <h3 class="text-lg font-semibold text-yellow-600 mb-3">10. Object Spread Operator (JSON5)</h3>
            <p class="font-medium mb-2">JEON:</p>
            <div class="collapsible-code">
              <button class="collapsible-btn text-blue-600 hover:text-blue-800 font-medium flex items-center">
                <span class="mr-2">▼</span> Show JEON
              </button>
              <div class="collapsible-content hidden">
                <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto language-json"><code class="language-json">{jeonExample10}</code></pre>
              </div>
            </div>
            <p class="font-medium mb-2">TypeScript:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto language-typescript"><code class="language-typescript">{tsExample10}</code></pre>
            <p class="text-sm text-gray-600 mt-2">Note: This feature requires JSON5 support to be enabled</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add collapsible functionality
const initCollapsible = () => {
  // Add collapsible functionality
  const collapsibleBtns = document.querySelectorAll('.collapsible-btn')
  collapsibleBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const content = this.nextElementSibling
      const icon = this.querySelector('span')
      const textNode = this.childNodes[this.childNodes.length - 1] // The last text node

      if (content.classList.contains('hidden')) {
        content.classList.remove('hidden')
        icon.textContent = '▲'
        // Update button text based on what it's showing
        if (textNode.textContent.includes('JEON')) {
          textNode.textContent = ' Hide JEON'
        } else if (textNode.textContent.includes('TypeScript')) {
          textNode.textContent = ' Hide TypeScript'
        } else {
          textNode.textContent = ' Hide Output'
        }
      } else {
        content.classList.add('hidden')
        icon.textContent = '▼'
        // Update button text based on what it's hiding
        if (textNode.textContent.includes('JEON')) {
          textNode.textContent = ' Show JEON'
        } else if (textNode.textContent.includes('TypeScript')) {
          textNode.textContent = ' Show TypeScript'
        } else {
          textNode.textContent = ' Show Output'
        }
      }
    })
  })
}

const ref = $()
useEffect(() => {
  initCollapsible()
})
render(<App ref={ref} />, document.getElementById('app'))