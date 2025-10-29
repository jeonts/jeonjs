import { expect, test } from '@woby/chk'
import { jeon2js } from '../jeon2js'
import { js2jeon } from '../js2jeon'

// Test async/await and JSX
const testCode = `
// Async function
async function fetchData() {
  const response = await fetch('/api/data')
  const data = await response.json()
  return data
}

// Async arrow function
const processData = async (input) => {
  const result = await fetchData()
  return result.filter(item => item.id === input.id)
}

// JSX element
const element = <div className="container" id="main">
  <h1>Hello World</h1>
  <p>{processData}</p>
</div>

// Async class method
class DataProcessor {
  async process() {
    try {
      const data = await fetchData()
      return data.map(item => ({...item, processed: true}))
    } catch (error) {
      console.error('Error processing data:', error)
      throw error
    }
  }
}
`

test('Async JSX Test', () => {
  test('Converts JS to JEON and back', () => {
    console.log('=== Original JavaScript Code ===')
    console.log(testCode)
    console.log('\n' + '='.repeat(50) + '\n')

    // Convert JS to JEON
    console.log('=== Converting JS to JEON ===')
    const jeon = js2jeon(testCode)
    expect(jeon).toBeDefined()
    expect(typeof jeon).toBe('object')
    console.log(JSON.stringify(jeon, null, 2))
    console.log('\n' + '='.repeat(50) + '\n')

    // Convert JEON back to JS
    console.log('=== Converting JEON back to JS ===')
    const regeneratedJs = jeon2js(jeon)
    expect(regeneratedJs).toBeDefined()
    expect(typeof regeneratedJs).toBe('string')
    console.log(regeneratedJs)

    // Check if they match
    console.log('\n' + '='.repeat(50) + '\n')
    console.log('=== SELF-CHECK RESULT ===')

    // Check that key elements are preserved
    expect(regeneratedJs).toContain('async function fetchData')
    expect(regeneratedJs).toContain('await fetch')
    expect(regeneratedJs).toContain('const element =')
    expect(regeneratedJs).toContain('class DataProcessor')
    expect(regeneratedJs).toContain('async process()')

    console.log('✅ Async JSX conversion completed successfully!')
  })
})