import './index.css'
import { $, $$, render, useEffect, type JSX, If } from 'woby'  // Add If to the import
import * as React from 'woby'
import { jeon2js } from './jeon2js'
import { js2jeon } from './js2jeon'
import { evalJeon } from './safeEval'
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
  const useClosure = $(false)
  const evalResult = $('')
  const evalContext = $('{}') // Add context for evalJeon

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

  // Helper functions for copy/paste operations
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(err => {
      console.error('Failed to copy text: ', err)
    })
  }

  const pasteFromClipboard = async (ref: HTMLPreElement | null, setter: (value: string) => void) => {
    try {
      const text = await navigator.clipboard.readText()
      if (ref) {
        ref.textContent = text
        setter(text)
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err)
    }
  }

  const paste = <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C11.2347 0 10.6293 0.125708 10.1567 0.359214C9.9845 0.44429 9.82065 0.544674 9.68861 0.62717L9.59036 0.688808C9.49144 0.751003 9.4082 0.803334 9.32081 0.853848C9.09464 0.984584 9.00895 0.998492 9.00053 0.999859C8.99983 0.999973 9.00019 0.999859 9.00053 0.999859C7.89596 0.999859 7 1.89543 7 3H6C4.34315 3 3 4.34315 3 6V20C3 21.6569 4.34315 23 6 23H18C19.6569 23 21 21.6569 21 20V6C21 4.34315 19.6569 3 18 3H17C17 1.89543 16.1046 1 15 1C15.0003 1 15.0007 1.00011 15 1C14.9916 0.998633 14.9054 0.984584 14.6792 0.853848C14.5918 0.80333 14.5086 0.751004 14.4096 0.688804L14.3114 0.62717C14.1793 0.544674 14.0155 0.44429 13.8433 0.359214C13.3707 0.125708 12.7653 0 12 0ZM16.7324 5C16.3866 5.5978 15.7403 6 15 6H9C8.25972 6 7.61337 5.5978 7.26756 5H6C5.44772 5 5 5.44772 5 6V20C5 20.5523 5.44772 21 6 21H18C18.5523 21 19 20.5523 19 20V6C19 5.44772 18.5523 5 18 5H16.7324ZM11.0426 2.15229C11.1626 2.09301 11.4425 2 12 2C12.5575 2 12.8374 2.09301 12.9574 2.15229C13.0328 2.18953 13.1236 2.24334 13.2516 2.32333L13.3261 2.37008C13.43 2.43542 13.5553 2.51428 13.6783 2.58539C13.9712 2.75469 14.4433 3 15 3V4H9V3C9.55666 3 10.0288 2.75469 10.3217 2.58539C10.4447 2.51428 10.57 2.43543 10.6739 2.37008L10.7484 2.32333C10.8764 2.24334 10.9672 2.18953 11.0426 2.15229Z" fill="#0F0F0F" />
  </svg>
  const copy = <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M21 8C21 6.34315 19.6569 5 18 5H10C8.34315 5 7 6.34315 7 8V20C7 21.6569 8.34315 23 10 23H18C19.6569 23 21 21.6569 21 20V8ZM19 8C19 7.44772 18.5523 7 18 7H10C9.44772 7 9 7.44772 9 8V20C9 20.5523 9.44772 21 10 21H18C18.5523 21 19 20.5523 19 20V8Z" fill="#0F0F0F" />
    <path d="M6 3H16C16.5523 3 17 2.55228 17 2C17 1.44772 16.5523 1 16 1H6C4.34315 1 3 2.34315 3 4V18C3 18.5523 3.44772 19 4 19C4.55228 19 5 18.5523 5 18V4C5 3.44772 5.44772 3 6 3Z" fill="#0F0F0F" />
  </svg>

  // Add function to evaluate JavaScript output using evalJeon
  const evaluateJsOutput = () => {
    try {
      // Get the current JavaScript output
      const jsCode = $$(jsOutput)
      if (!jsCode || jsCode.startsWith('Error:')) {
        evalResult('Error: No valid JavaScript output to evaluate')
        return
      }

      // Parse the JEON from the original input to get the structure
      const refElement = $$(jeonInputRef)
      const jeonText = refElement ? (refElement.textContent || refElement.innerText) : ''

      if (!jeonText) {
        evalResult('Error: No JEON input found')
        return
      }

      const jeon = useJSON5() ? JSON5.parse(jeonText) : JSON.parse(jeonText)

      // Parse the context JSON
      let context = {}
      try {
        const contextText = $$(evalContext)
        // Use JSON5 or standard JSON based on the useJSON5 flag
        context = contextText ? (useJSON5() ? JSON5.parse(contextText) : JSON.parse(contextText)) : {}
      } catch (contextError) {
        evalResult('Error: Invalid context JSON')
        return
      }

      // Evaluate using evalJeon with context
      const result = evalJeon(jeon, context)
      evalResult(JSON.stringify(result, null, 2))
    } catch (error: any) {
      console.error('evalJeon error:', error)
      evalResult(`Error: ${error.message}`)
    }
  }

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
          <div class="w-full lg:w-1/2 relative">
            <div class="flex justify-between items-center mb-2">
              <h2 class="text-xl font-bold">JEON to JavaScript</h2>
              <div class="flex gap-2">
                <button
                  onClick={() => {
                    const refElement = $$(jeonInputRef)
                    const currentValue = refElement ? (refElement.textContent || refElement.innerText) : ''
                    copyToClipboard(currentValue)
                  }}
                  class="flex items-center text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-2 rounded"
                  title="Copy"
                >
                  {copy}
                </button>
                <button
                  onClick={() => {
                    pasteFromClipboard($$(jeonInputRef), jeonInput)
                  }}
                  class="flex items-center text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-2 rounded"
                  title="Paste"
                >
                  {paste}
                </button>
              </div>
            </div>
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

          <div class="w-full lg:w-1/2 relative">
            <div class="flex justify-between items-center mb-2">
              <h2 class="text-xl font-bold">JavaScript to JEON</h2>
              <div class="flex gap-2">
                <button
                  onClick={() => {
                    const refElement = $$(jsInputRef)
                    const currentValue = refElement ? (refElement.textContent || refElement.innerText) : ''
                    copyToClipboard(currentValue)
                  }}
                  class="flex items-center text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-2 rounded"
                  title="Copy"
                >
                  {copy}
                </button>
                <button
                  onClick={() => {
                    pasteFromClipboard($$(jsInputRef), jsInput)
                  }}
                  class="flex items-center text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-2 rounded"
                  title="Paste"
                >
                  {paste}
                </button>
              </div>
            </div>
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
          <div class="w-full lg:w-1/2 relative">
            <div class="flex justify-between items-center mb-2">
              <h2 class="text-xl font-bold">JavaScript Output</h2>
              <button
                onClick={() => copyToClipboard($$(jsOutput))}
                class="flex items-center text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-2 rounded"
                title="Copy"
              >
                {copy}
              </button>
            </div>
            <pre
              id="ts-output"
              class="w-full h-64 font-mono text-sm p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 overflow-auto"
            >
              <code ref={tsOutputCodeRef} id="ts-output-code"></code>
            </pre>
            {/* Add evalJeon button that only shows when closure is checked */}
            <If when={() => $$(useClosure)}>
              <div class="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <button
                  onClick={evaluateJsOutput}
                  class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 ease-in-out shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                  </svg>
                  Evaluate with evalJeon
                </button>

                {/* Add context input box */}
                <div class="mt-4">
                  <label class="block text-sm font-semibold text-green-800 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm8 0a2 2 0 114 0 2 2 0 01-4 0z" />
                    </svg>
                    Evaluation Context (JSON):
                  </label>
                  <textarea
                    value={evalContext}
                    onInput={(e: any) => evalContext(e.target.value)}
                    class="w-full h-24 font-mono text-sm p-3 border border-green-300 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    placeholder='{"variableName": "value", "anotherVar": 42}'
                  />
                  <p class="mt-1 text-xs text-green-600">Enter JSON context for variable evaluation</p>
                </div>

                {/* Add eval result display */}
                <div class="mt-4">
                  <label class="block text-sm font-semibold text-green-800 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                    </svg>
                    Evaluation Result:
                  </label>
                  <pre
                    class="w-full h-32 font-mono text-sm p-3 border border-green-300 rounded-md bg-green-100 text-green-900 overflow-auto"
                  >
                    {evalResult}
                  </pre>
                </div>
              </div>
            </If>
          </div>

          <div class="w-full lg:w-1/2 relative">
            <div class="flex justify-between items-center mb-2">
              <h2 class="text-xl font-bold">JEON Output</h2>
              <button
                onClick={() => copyToClipboard($$(jeonOutput))}
                class="flex items-center text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-2 rounded"
                title="Copy"
              >
                {copy}
              </button>
            </div>
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