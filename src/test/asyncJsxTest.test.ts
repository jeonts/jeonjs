import { expect, test } from '@woby/chk'
import { jeon2js } from '../jeon2js'
import { js2jeon } from '../js2jeon'
import { normalizeJs } from './testUtils'

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
  test('Converts JS to JEON and back with direct normalized string comparison', () => {
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

    // Normalize both codes for comparison
    const normalizedOriginal = normalizeJs(testCode)
    const normalizedRegenerated = normalizeJs(regeneratedJs)

    console.log('\n=== Normalized Comparison ===')
    console.log('Original:', normalizedOriginal)
    console.log('Regenerated:', normalizedRegenerated)

    // Direct normalized string comparison
    expect(normalizedRegenerated).toBe(normalizedOriginal)

    console.log('\n' + '='.repeat(50) + '\n')
    console.log('=== SELF-CHECK RESULT ===')
    console.log('✅ Async JSX conversion with direct normalized string comparison completed successfully!')
  })
})