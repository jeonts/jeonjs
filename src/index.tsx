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

// Add CSS for collapsible functionality
const customCSS = `
.collapsible-code {
    margin: 1rem 0;
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
`

const outputDiv = 'border border-gray-300 rounded-md p-3 bg-gray-50 overflow-auto resize-y min-h-[200px] font-mono text-sm whitespace-pre'

// CSS class constants for better maintainability
const container = 'max-w-6xl mx-auto p-5 bg-gray-800 text-white'
const mainCard = 'bg-white rounded-lg shadow-lg p-6 my-6 text-gray-800'
const title = 'text-3xl font-bold text-center text-gray-800 mb-4'
const subtitle = 'text-center text-gray-600 mb-8'
const checkboxContainer = 'flex items-center mb-4'
const checkbox = 'mr-2'
const checkboxLabel = 'text-gray-700'
const inputSection = 'flex flex-col md:flex-row gap-6 mb-8'
const inputColumn = 'flex-1 flex flex-col'
const sectionTitle = 'text-xl font-semibold text-gray-800 mb-3'
const editableDiv = 'w-full h-80 font-mono text-sm p-3 border border-gray-300 rounded-md resize-y text-gray-800 overflow-auto bg-white editable-div'
const primaryButton = 'mt-3 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200'
const outputSection = 'flex flex-col md:flex-row gap-6'
const exampleSection = 'mt-10'
const exampleTitle = 'text-2xl font-bold text-gray-800 mb-5'
const exampleCard = 'mb-5 p-5 bg-gray-50 border-l-4 border-blue-500 rounded-r'
const exampleCardGreen = 'mb-5 p-5 bg-gray-50 border-l-4 border-green-500 rounded-r'
const exampleCardPurple = 'mb-5 p-5 bg-gray-50 border-l-4 border-purple-500 rounded-r'
const exampleCardYellow = 'p-5 bg-gray-50 border-l-4 border-yellow-500 rounded-r'
const exampleSubtitle = 'text-lg font-semibold text-blue-600 mb-3'
const exampleSubtitleGreen = 'text-lg font-semibold text-green-600 mb-3'
const exampleSubtitlePurple = 'text-lg font-semibold text-purple-600 mb-3'
const exampleSubtitleYellow = 'text-lg font-semibold text-yellow-600 mb-3'
const fontMedium = 'font-medium'
const fontMediumMb2 = 'font-medium mb-2'
const preCodeBlock = 'bg-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto language-json'
const preCodeBlockLast = 'bg-gray-100 p-3 rounded text-sm overflow-x-auto language-json'
const preCodeBlockTs = 'bg-gray-100 p-3 rounded text-sm overflow-x-auto language-typescript'
const collapsibleCode = 'collapsible-code'
const collapsibleContent = 'collapsible-content hidden'
const smallText = 'text-sm text-gray-600 mt-2'

// Collapsible button styles
const collapsibleBtn = 'background-none border-none py-2 px-4 cursor-pointer text-left w-full rounded-lg'
const collapsibleBtnHover = 'hover:bg-gray-100'

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
  const jsInput = $('function sum(a, b) {\n  return a + b;\n}')
  const jsOutput = $('')
  const jeonOutput = $('')
  const useJSON5 = $(false)

  // Create observable refs for the contentEditable divs
  const jeonInputRef = $<HTMLPreElement | null>(null)
  const jsInputRef = $<HTMLPreElement | null>(null)

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
          const highlighted = Prism.highlight(content, Prism.languages.typescript, 'typescript')
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
    // Don't update the observable on input to prevent cursor reset
    // The value will be captured when the convert button is clicked
  }

  const handleTsInput = (e: any) => {
    // Don't update the observable on input to prevent cursor reset
    // The value will be captured when the convert button is clicked
  }

  const convertJeonToTs = () => {
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
      // Pass the JSON implementation to jeon2js
      const code = jeon2js(jeon, { json: useJSON5() ? JSON5Wrapper : JSON })
      console.log('Converted TypeScript code:', code)
      jsOutput(code)
    } catch (error: any) {
      console.error('convertJeonToTs error:', error)
      jsOutput(`Error: ${error.message}`)
    }
  }

  const convertTsToJeon = () => {
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
    convertJeonToTs()
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
    <div class={container}>
      <div class={mainCard}>
        <h1 class={title}>JEON Converter Demo</h1>
        <p class={subtitle}>A bidirectional converter between JEON (JSON-based Executable Object Notation) and TypeScript/JavaScript.</p>

        <div class={checkboxContainer}>
          <input
            type="checkbox"
            id="useJSON5"
            checked={useJSON5()}
            onChange={(e: any) => useJSON5(e.target.checked)}
            class={checkbox}
          />
          <label for="useJSON5" class={checkboxLabel}>
            Use JSON5 (allows comments, trailing commas, etc.)
          </label>
        </div>

        <div class={inputSection}>
          <div class={inputColumn}>
            <h2 class={sectionTitle}>JEON to TypeScript</h2>
            <pre
              ref={jeonInputRef}
              contentEditable
              onInput={handleJeonInput}
              class={editableDiv}
            >{jeonInput}</pre>
            <button
              onClick={convertJeonToTs}
              class={primaryButton}
            >
              Convert to TypeScript
            </button>
          </div>

          <div class={inputColumn}>
            <h2 class={sectionTitle}>TypeScript to JEON</h2>
            <pre
              ref={jsInputRef}
              contentEditable
              onInput={handleTsInput}
              class={editableDiv}
            >{jsInput}</pre>
            <button
              onClick={convertTsToJeon}
              class={primaryButton}
            >
              Convert to JEON
            </button>
          </div>
        </div>

        <div class={outputSection}>
          <div class={inputColumn}>
            <h2 class={sectionTitle}>TypeScript Output</h2>
            <pre
              id="ts-output"
              class={['w-full h-80 font-mono text-sm p-3 border border-gray-300 rounded-md resize-y bg-gray-50 text-gray-800 overflow-auto', outputDiv]}
            ><code id="ts-output-code" dangerouslySetInnerHTML={{ __html: highlightedJsOutput }} /></pre>
          </div>

          <div class={inputColumn}>
            <h2 class={sectionTitle}>JEON Output</h2>
            <pre
              id="jeon-output"
              class={['w-full h-80 font-mono text-sm p-3 border border-gray-300 rounded-md resize-y bg-gray-50 text-gray-800 overflow-auto', outputDiv]}
            ><code id="jeon-output-code" dangerouslySetInnerHTML={{ __html: highlightedJeonOutput }} /></pre>
          </div>
        </div>

        <div class={exampleSection}>
          <h2 class={exampleTitle}>Example Conversions</h2>

          <div class={exampleCard}>
            <h3 class={exampleSubtitle}>1. Function Declaration</h3>
            <p class={fontMediumMb2}>JEON:</p>
            <pre class={preCodeBlock}><code class="language-json">{jeonExample1}</code></pre>
            <p class={fontMediumMb2}>TypeScript:</p>
            <pre class={preCodeBlockTs}><code class="language-typescript">{tsExample1}</code></pre>
          </div>

          <div class={exampleCard}>
            <h3 class={exampleSubtitle}>2. Variable Declaration</h3>
            <p class={fontMediumMb2}>JEON:</p>
            <pre class={preCodeBlock}><code class="language-json">{jeonExample2}</code></pre>
            <p class={fontMediumMb2}>TypeScript:</p>
            <pre class={preCodeBlockTs}><code class="language-typescript">{tsExample2}</code></pre>
          </div>

          <div class={exampleCard}>
            <h3 class={exampleSubtitle}>3. Arrow Function</h3>
            <p class={fontMediumMb2}>JEON:</p>
            <pre class={preCodeBlock}><code class="language-json">{jeonExample3}</code></pre>
            <p class={fontMediumMb2}>TypeScript:</p>
            <pre class={preCodeBlockTs}><code class="language-typescript">{tsExample3}</code></pre>
          </div>

          <div class={exampleCardGreen}>
            <h3 class={exampleSubtitleGreen}>4. Generator Function</h3>
            <p class={fontMediumMb2}>JEON:</p>
            <div class={collapsibleCode}>
              <button class={collapsibleBtn}>
                <span class="mr-2">▼</span> Show JEON
              </button>
              <div class={collapsibleContent}>
                <pre class={preCodeBlock}><code class="language-json">{jeonExample4}</code></pre>
              </div>
            </div>
            <p class={fontMediumMb2}>TypeScript:</p>
            <pre class={preCodeBlockTs}><code class="language-typescript">{tsExample4}</code></pre>
          </div>

          <div class={exampleCardGreen}>
            <h3 class={exampleSubtitleGreen}>5. Async/Await</h3>
            <p class={fontMediumMb2}>JEON:</p>
            <div class={collapsibleCode}>
              <button class={collapsibleBtn}>
                <span class="mr-2">▼</span> Show JEON
              </button>
              <div class={collapsibleContent}>
                <pre class={preCodeBlock}><code class="language-json">{jeonExample5}</code></pre>
              </div>
            </div>
            <p class={fontMediumMb2}>TypeScript:</p>
            <pre class={preCodeBlockTs}><code class="language-typescript">{tsExample5}</code></pre>
          </div>

          <div class={exampleCardGreen}>
            <h3 class={exampleSubtitleGreen}>6. JSX Elements</h3>
            <p class={fontMediumMb2}>JEON:</p>
            <div class={collapsibleCode}>
              <button class={collapsibleBtn}>
                <span class="mr-2">▼</span> Show JEON
              </button>
              <div class={collapsibleContent}>
                <pre class={preCodeBlock}><code class="language-json">{jeonExample6}</code></pre>
              </div>
            </div>
            <p class={fontMediumMb2}>TypeScript:</p>
            <pre class={preCodeBlockTs}><code class="language-typescript">{tsExample6}</code></pre>
          </div>

          <div class={exampleCardGreen}>
            <h3 class={exampleSubtitleGreen}>7. Array Spread Operator</h3>
            <p class={fontMediumMb2}>JEON:</p>
            <div class={collapsibleCode}>
              <button class={collapsibleBtn}>
                <span class="mr-2">▼</span> Show JEON
              </button>
              <div class={collapsibleContent}>
                <pre class={preCodeBlock}><code class="language-json">{jeonExample7}</code></pre>
              </div>
            </div>
            <p class={fontMediumMb2}>TypeScript:</p>
            <pre class={preCodeBlockTs}><code class="language-typescript">{tsExample7}</code></pre>
          </div>

          <div class={exampleCardPurple}>
            <h3 class={exampleSubtitlePurple}>8. Class Declaration</h3>
            <p class={fontMediumMb2}>JEON:</p>
            <div class={collapsibleCode}>
              <button class={collapsibleBtn}>
                <span class="mr-2">▼</span> Show JEON
              </button>
              <div class={collapsibleContent}>
                <pre class={preCodeBlock}><code class="language-json">{jeonExample8}</code></pre>
              </div>
            </div>
            <p class={fontMediumMb2}>TypeScript:</p>
            <div class={collapsibleCode}>
              <button class={collapsibleBtn}>
                <span class="mr-2">▼</span> Show TypeScript
              </button>
              <div class={collapsibleContent}>
                <pre class={preCodeBlockTs}><code class="language-typescript">{tsExample8}</code></pre>
              </div>
            </div>
          </div>

          <div class={exampleCardPurple}>
            <h3 class={exampleSubtitlePurple}>9. Assigned Class</h3>
            <p class={fontMediumMb2}>JEON:</p>
            <div class={collapsibleCode}>
              <button class={collapsibleBtn}>
                <span class="mr-2">▼</span> Show JEON
              </button>
              <div class={collapsibleContent}>
                <pre class={preCodeBlock}><code class="language-json">{jeonExample9}</code></pre>
              </div>
            </div>
            <p class={fontMediumMb2}>TypeScript:</p>
            <div class={collapsibleCode}>
              <button class={collapsibleBtn}>
                <span class="mr-2">▼</span> Show TypeScript
              </button>
              <div class={collapsibleContent}>
                <pre class={preCodeBlockTs}><code class="language-typescript">{tsExample9}</code></pre>
              </div>
            </div>
          </div>

          <div class={exampleCardYellow}>
            <h3 class={exampleSubtitleYellow}>10. Object Spread Operator (JSON5)</h3>
            <p class={fontMediumMb2}>JEON:</p>
            <div class={collapsibleCode}>
              <button class={collapsibleBtn}>
                <span class="mr-2">▼</span> Show JEON
              </button>
              <div class={collapsibleContent}>
                <pre class={preCodeBlock}><code class="language-json">{jeonExample10}</code></pre>
              </div>
            </div>
            <p class={fontMediumMb2}>TypeScript:</p>
            <pre class={preCodeBlockTs}><code class="language-typescript">{tsExample10}</code></pre>
            <p class={smallText}>Note: This feature requires JSON5 support to be enabled</p>
          </div>
        </div>
      </div>
    </div >
  )
}

// Add collapsible functionality
const initCollapsible = () => {
  // Add collapsible functionality
  const collapsibleBtns = document.querySelectorAll('button')
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
          } else if (textNode.textContent.includes('TypeScript')) {
            textNode.textContent = ' Hide TypeScript'
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
          } else if (textNode.textContent.includes('TypeScript')) {
            textNode.textContent = ' Show TypeScript'
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