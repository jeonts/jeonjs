import './index.css'
import { $, $$, render, useEffect, type JSX } from 'woby'
import * as React from 'woby'
import { jeon2js } from './jeon2js'
import { js2jeon } from './js2jeon'
import JSON5 from 'json5'
// Import PrismJS for syntax highlighting
import * as Prism from 'prismjs'
import 'prismjs/themes/prism.css'
// Import language components for syntax highlighting (keeping only one JavaScript import)
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-json'

// Remove customCSS variable and CSS injection

// Remove all CSS class constants

const App = () => {
  const jeonInput = $(`{
  "function(a, b)": [
    { "return": { "+": ["@a", "@b"] } }
  ]
}`)
  const jsInput = $('function sum(a, b) {\n  return a + b;\n}')
  const jsOutput = $('')
  const jeonOutput = $('')
  const useJSON5 = $(false)
  const useClosure = $(false) // Add closure option

  // Create observable refs for the contentEditable divs
  const jeonInputRef = $<HTMLPreElement | null>(null)
  const jsInputRef = $<HTMLPreElement | null>(null)
  const tsOutputCodeRef = $<HTMLElement | null>(null)
  const jeonOutputCodeRef = $<HTMLElement | null>(null)

  // Create reactive variables to store highlighted HTML
  const highlightedJsOutput = $('')
  const highlightedJeonOutput = $('')

  // Effect to update highlighted content when jsOutput changes
  useEffect(() => {
    const updateHighlightedJsOutput = () => {
      const content = $$(jsOutput)
      console.log('Updating JS output highlight, content:', content)
      if (content) {
        try {
          const highlighted = Prism.highlight(content, Prism.languages.javascript, 'javascript')
          console.log('Highlighted JS output:', highlighted)
          highlightedJsOutput(highlighted)
        } catch (e) {
          console.error('Error highlighting JS output:', e)
          // Fallback to plain text if highlighting fails
          highlightedJsOutput(content)
        }
      }
    }

    updateHighlightedJsOutput()
  })

  // Effect to update highlighted content when jeonOutput changes
  useEffect(() => {
    const updateHighlightedJeonOutput = () => {
      const content = $$(jeonOutput)
      console.log('Updating JEON output highlight, content:', content)
      if (content) {
        try {
          // Try to parse as JSON first for better formatting
          let formattedContent = content
          try {
            const parsed = JSON.parse(content)
            formattedContent = JSON.stringify(parsed, null, 2)
          } catch {
            // If not valid JSON, use content as is
          }
          const highlighted = Prism.highlight(formattedContent, Prism.languages.json, 'json')
          console.log('Highlighted JEON output:', highlighted)
          highlightedJeonOutput(highlighted)
        } catch (e) {
          console.error('Error highlighting JEON output:', e)
          // Fallback to plain text if highlighting fails
          highlightedJeonOutput(content)
        }
      }
    }

    updateHighlightedJeonOutput()
  })

  // Effect to update the DOM with highlighted content
  useEffect(() => {
    const tsOutputElement = $$(tsOutputCodeRef)
    if (tsOutputElement) {
      tsOutputElement.innerHTML = $$(highlightedJsOutput)
    }
  })

  useEffect(() => {
    const jeonOutputElement = $$(jeonOutputCodeRef)
    if (jeonOutputElement) {
      jeonOutputElement.innerHTML = $$(highlightedJeonOutput)
    }
  })


  // Function to handle paste events and prevent nested pre elements
  const handleJeonPaste = (e: ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData?.getData('text/plain') || ''
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(document.createTextNode(text))
      selection.removeAllRanges()
      selection.selectAllChildren(range.startContainer)
    }
  }

  const handleTsPaste = (e: ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData?.getData('text/plain') || ''
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(document.createTextNode(text))
      selection.removeAllRanges()
      selection.selectAllChildren(range.startContainer)
    }
  }

  // Function to handle input changes with syntax highlighting
  const handleJeonInput = (e: any) => {
    // Don't update the observable on input to prevent cursor reset
    // The value will be captured when the convert button is clicked
  }

  const handleTsInput = (e: any) => {
    // Don't update the observable on input to prevent cursor reset
    // The value will be captured when the convert button is clicked
  }

  // Add useEffect to attach paste event listeners
  useEffect(() => {
    const jeonElement = $$(jeonInputRef)
    const jsElement = $$(jsInputRef)

    if (jeonElement) {
      jeonElement.addEventListener('paste', handleJeonPaste as EventListener)
    }

    if (jsElement) {
      jsElement.addEventListener('paste', handleTsPaste as EventListener)
    }

    // Cleanup event listeners
    return () => {
      if (jeonElement) {
        jeonElement.removeEventListener('paste', handleJeonPaste as EventListener)
      }
      if (jsElement) {
        jsElement.removeEventListener('paste', handleTsPaste as EventListener)
      }
    }
  })

  const convertJeonToJs = () => {
    try {
      // Get the current value from the contentEditable div using observable ref
      const refElement = $$(jeonInputRef)
      const currentValue = refElement ? (refElement.textContent || refElement.innerText) : ''

      // Note: We don't update jeonInput here because we're reading from the DOM directly
      // The jeonInput observable is for the reactive state that drives the UI

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

      const jeon = useJSON5() ? JSON5.parse(currentValue) : JSON.parse(currentValue)
      // Pass the JSON implementation and closure option to jeon2js
      // Note: We do NOT format the output in 1 line even when closure is checked
      const code = jeon2js(jeon, { json: useJSON5() ? JSON5Wrapper : JSON, closure: useClosure() })
      console.log('Converted JavaScript code:', code)
      jsOutput(code)
    } catch (error: any) {
      console.error('convertJeonToTs error:', error)
      jsOutput(`Error: ${error.message}`)
    }
  }

  const convertJsToJeon = () => {
    try {
      // Get the current value from the contentEditable div using observable ref
      const refElement = $$(jsInputRef)
      const currentValue = refElement ? (refElement.textContent || refElement.innerText) : ''

      // Note: We don't update jsInput here because we're reading from the DOM directly
      // The jsInput observable is for the reactive state that drives the UI

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

      // Auto-wrap JavaScript code to make it parseable
      let codeToParse = currentValue as string
      let originalInput = codeToParse
      let jeon

      try {
        // First try to parse as-is
        jeon = js2jeon(codeToParse, { json: useJSON5() ? JSON5Wrapper : JSON })

        // Check if result is a labeled statement, which usually means we need wrapping
        if (jeon === '[LabeledStatement]') {
          throw new Error('Parsed as labeled statement, trying with parentheses')
        }
      } catch (parseError) {
        // If parsing fails or produces a labeled statement, try wrapping with parentheses
        try {
          const wrappedCode = `(${codeToParse})`
          const wrappedJeon = js2jeon(wrappedCode, { json: useJSON5() ? JSON5Wrapper : JSON })

          // If successful and not a labeled statement, update the input and use the wrapped result
          if (wrappedJeon !== '[LabeledStatement]') {
            jeon = wrappedJeon
            // Update the input to show the wrapped version
            jsInput(wrappedCode)
            // Also update the contentEditable div directly to reflect the change
            if (refElement) {
              refElement.textContent = wrappedCode
            }
          } else {
            // If wrapping also produces a labeled statement, use the original result
            // This maintains backward compatibility
            jeon = '[LabeledStatement]'
          }
        } catch (wrappedError) {
          // If wrapping also fails, use the original error or result
          if (parseError.message === 'Parsed as labeled statement, trying with parentheses') {
            // If it was our special labeled statement error, use the labeled statement result
            jeon = '[LabeledStatement]'
          } else {
            // Otherwise throw the original parsing error
            throw parseError
          }
        }
      }

      const formatted = useJSON5() ? JSON5Wrapper.stringify(jeon, null, 2) : JSON.stringify(jeon, null, 2)
      console.log('Converted JEON:', formatted)
      jeonOutput(formatted)
      console.log('JEON output set to:', formatted)
    } catch (error: any) {
      console.error('convertTsToJeon error:', error)
      jeonOutput(`Error: ${error.message}`)
    }
  }

  // Initialize with conversion and highlighting
  useEffect(() => {
    convertJeonToJs()
    convertJsToJeon()
  })

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
        <p class="text-center text-gray-600 mb-8">A bidirectional converter between JEON (JSON-based Executable Object Notation) and JavaScript/JavaScript.</p>

        <div class="flex items-center justify-left mb-4">
          <input
            type="checkbox"
            id="useJSON5"
            checked={useJSON5()}
            onChange={(e: any) => useJSON5(e.target.checked)}
            class="mr-2"
          />
          <label for="useJSON5" class="text-gray-600">
            Use JSON5 (allows comments, trailing commas, etc.)
          </label>
        </div>

        <div class="flex items-center justify-left mb-4">
          <input
            type="checkbox"
            id="useClosure"
            checked={useClosure()}
            onChange={(e: any) => useClosure(e.target.checked)}
            class="mr-2"
          />
          <label for="useClosure" class="text-gray-600">
            Use Closure (enables safe evaluation)
          </label>
        </div>

        <div class="flex flex-col lg:flex-row justify-center mb-4 gap-4">
          <div class="w-full lg:w-1/2">
            <h2 class="text-xl font-bold mb-2">JEON to JavaScript</h2>
            <pre
              ref={jeonInputRef}
              contentEditable
              onInput={handleJeonInput}
              class="w-full h-64 font-mono text-sm p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 overflow-auto"
            >{jeonInput}</pre>
            <button
              onClick={convertJeonToJs}
              class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 hover:bg-blue-600 transition-colors"
            >
              Convert to JavaScript
            </button>
          </div>

          <div class="w-full lg:w-1/2">
            <h2 class="text-xl font-bold mb-2">JavaScript to JEON</h2>
            <pre
              ref={jsInputRef}
              contentEditable
              onInput={handleTsInput}
              class="w-full h-64 font-mono text-sm p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 overflow-auto"
            >{jsInput}</pre>
            <button
              onClick={convertJsToJeon}
              class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 hover:bg-blue-600 transition-colors"
            >
              Convert to JEON
            </button>
          </div>
        </div>

        <div class="flex flex-col lg:flex-row justify-center mb-4 gap-4">
          <div class="w-full lg:w-1/2">
            <h2 class="text-xl font-bold mb-2">JavaScript Output</h2>
            <pre
              id="ts-output"
              class="w-full h-64 font-mono text-sm p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 overflow-auto"
            >
              <code ref={tsOutputCodeRef} id="ts-output-code"></code>
            </pre>
          </div>

          <div class="w-full lg:w-1/2">
            <h2 class="text-xl font-bold mb-2">JEON Output</h2>
            <pre
              id="jeon-output"
              class="w-full h-64 font-mono text-sm p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 overflow-auto"
            >
              <code ref={jeonOutputCodeRef} id="jeon-output-code"></code>
            </pre>
          </div>
        </div>

        <div class="mb-4">
          <h2 class="text-xl font-bold mb-4">Example Conversions</h2>

          <div class="bg-gray-100 p-4 mb-4 rounded-lg">
            <h3 class="text-lg font-bold mb-2">1. Function Declaration</h3>
            <p class="font-medium mb-2">JEON:</p>
            <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto language-json"><code class="language-json">{jeonExample1}</code></pre>
            <p class="font-medium mb-2">JavaScript:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto language-JavaScript"><code class="language-JavaScript">{tsExample1}</code></pre>
          </div>

          <div class="bg-gray-100 p-4 mb-4 rounded-lg">
            <h3 class="text-lg font-bold mb-2">2. Variable Declaration</h3>
            <p class="font-medium mb-2">JEON:</p>
            <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto language-json"><code class="language-json">{jeonExample2}</code></pre>
            <p class="font-medium mb-2">JavaScript:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto language-JavaScript"><code class="language-JavaScript">{tsExample2}</code></pre>
          </div>

          <div class="bg-gray-100 p-4 mb-4 rounded-lg">
            <h3 class="text-lg font-bold mb-2">3. Arrow Function</h3>
            <p class="font-medium mb-2">JEON:</p>
            <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto language-json"><code class="language-json">{jeonExample3}</code></pre>
            <p class="font-medium mb-2">JavaScript:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto language-JavaScript"><code class="language-JavaScript">{tsExample3}</code></pre>
          </div>

          <div class="bg-gray-100 p-4 mb-4 rounded-lg">
            <h3 class="text-lg font-bold mb-2">4. Generator Function</h3>
            <p class="font-medium mb-2">JEON:</p>
            <div class="collapsible-code">
              <button class="collapsible-btn">
                <span class="mr-2">▼</span> Show JEON
              </button>
              <div class="collapsible-content hidden">
                <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto language-json"><code class="language-json">{jeonExample4}</code></pre>
              </div>
            </div>
            <p class="font-medium mb-2">JavaScript:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto language-JavaScript"><code class="language-JavaScript">{tsExample4}</code></pre>
          </div>

          <div class="bg-gray-100 p-4 mb-4 rounded-lg">
            <h3 class="text-lg font-bold mb-2">5. Async/Await</h3>
            <p class="font-medium mb-2">JEON:</p>
            <div class="collapsible-code">
              <button class="collapsible-btn">
                <span class="mr-2">▼</span> Show JEON
              </button>
              <div class="collapsible-content hidden">
                <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto language-json"><code class="language-json">{jeonExample5}</code></pre>
              </div>
            </div>
            <p class="font-medium mb-2">JavaScript:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto language-JavaScript"><code class="language-JavaScript">{tsExample5}</code></pre>
          </div>

          <div class="bg-gray-100 p-4 mb-4 rounded-lg">
            <h3 class="text-lg font-bold mb-2">6. JSX Elements</h3>
            <p class="font-medium mb-2">JEON:</p>
            <div class="collapsible-code">
              <button class="collapsible-btn">
                <span class="mr-2">▼</span> Show JEON
              </button>
              <div class="collapsible-content hidden">
                <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto language-json"><code class="language-json">{jeonExample6}</code></pre>
              </div>
            </div>
            <p class="font-medium mb-2">JavaScript:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto language-JavaScript"><code class="language-JavaScript">{tsExample6}</code></pre>
          </div>

          <div class="bg-gray-100 p-4 mb-4 rounded-lg">
            <h3 class="text-lg font-bold mb-2">7. Array Spread Operator</h3>
            <p class="font-medium mb-2">JEON:</p>
            <div class="collapsible-code">
              <button class="collapsible-btn">
                <span class="mr-2">▼</span> Show JEON
              </button>
              <div class="collapsible-content hidden">
                <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto language-json"><code class="language-json">{jeonExample7}</code></pre>
              </div>
            </div>
            <p class="font-medium mb-2">JavaScript:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto language-JavaScript"><code class="language-JavaScript">{tsExample7}</code></pre>
          </div>

          <div class="bg-gray-100 p-4 mb-4 rounded-lg">
            <h3 class="text-lg font-bold mb-2">8. Class Declaration</h3>
            <p class="font-medium mb-2">JEON:</p>
            <div class="collapsible-code">
              <button class="collapsible-btn">
                <span class="mr-2">▼</span> Show JEON
              </button>
              <div class="collapsible-content hidden">
                <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto language-json"><code class="language-json">{jeonExample8}</code></pre>
              </div>
            </div>
            <p class="font-medium mb-2">JavaScript:</p>
            <div class="collapsible-code">
              <button class="collapsible-btn">
                <span class="mr-2">▼</span> Show JavaScript
              </button>
              <div class="collapsible-content hidden">
                <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto language-JavaScript"><code class="language-JavaScript">{tsExample8}</code></pre>
              </div>
            </div>
          </div>

          <div class="bg-gray-100 p-4 mb-4 rounded-lg">
            <h3 class="text-lg font-bold mb-2">9. Assigned Class</h3>
            <p class="font-medium mb-2">JEON:</p>
            <div class="collapsible-code">
              <button class="collapsible-btn">
                <span class="mr-2">▼</span> Show JEON
              </button>
              <div class="collapsible-content hidden">
                <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto language-json"><code class="language-json">{jeonExample9}</code></pre>
              </div>
            </div>
            <p class="font-medium mb-2">JavaScript:</p>
            <div class="collapsible-code">
              <button class="collapsible-btn">
                <span class="mr-2">▼</span> Show JavaScript
              </button>
              <div class="collapsible-content hidden">
                <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto language-JavaScript"><code class="language-JavaScript">{tsExample9}</code></pre>
              </div>
            </div>
          </div>

          <div class="bg-gray-100 p-4 mb-4 rounded-lg">
            <h3 class="text-lg font-bold mb-2">10. Object Spread Operator (JSON5)</h3>
            <p class="font-medium mb-2">JEON:</p>
            <div class="collapsible-code">
              <button class="collapsible-btn">
                <span class="mr-2">▼</span> Show JEON
              </button>
              <div class="collapsible-content hidden">
                <pre class="bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto language-json"><code class="language-json">{jeonExample10}</code></pre>
              </div>
            </div>
            <p class="font-medium mb-2">JavaScript:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto language-JavaScript"><code class="language-JavaScript">{tsExample10}</code></pre>
            <p class="text-sm text-gray-600 mt-2">Note: This feature requires JSON5 support to be enabled</p>
          </div>
        </div>
      </div>
    </div >
  )
}

// Add collapsible functionality
const initCollapsible = () => {
  // Add collapsible functionality only to buttons with collapsible-btn class
  const collapsibleBtns = document.querySelectorAll('.collapsible-btn')
  collapsibleBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const content = this.nextElementSibling
      const icon = this.querySelector('span')
      const textNode = this.childNodes[this.childNodes.length - 1] // The last text node

      if (content && content.classList.contains('hidden')) {
        content.classList.remove('hidden')
        if (icon) icon.textContent = '▲'
        // Update button text based on what it's showing
        if (textNode && textNode.textContent) {
          if (textNode.textContent.includes('JEON')) {
            textNode.textContent = ' Hide JEON'
          } else if (textNode.textContent.includes('JavaScript')) {
            textNode.textContent = ' Hide JavaScript'
          } else {
            textNode.textContent = ' Hide Output'
          }
        }
      } else {
        if (content) content.classList.add('hidden')
        if (icon) icon.textContent = '▼'
        // Update button text based on what it's hiding
        if (textNode && textNode.textContent) {
          if (textNode.textContent.includes('JEON')) {
            textNode.textContent = ' Show JEON'
          } else if (textNode.textContent.includes('JavaScript')) {
            textNode.textContent = ' Show JavaScript'
          } else {
            textNode.textContent = ' Show Output'
          }
        }
      }
    })
  })
}

useEffect(() => {
  initCollapsible()
})
render(<App />, document.getElementById('app'))