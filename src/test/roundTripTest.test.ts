import { expect, test } from '@woby/chk'
import { jeon2js } from '../jeon2js'
import { js2jeon } from '../js2jeon'
import { normalizeJs } from './testUtils'

// Simple class code to test round-trip conversion
const code = `
class MyClass {
  static staticProperty = 'static value';
  
  constructor(name) {
    this.name = name;
    this.items = [];
  }
  
  get displayName() {
    return this.name.toUpperCase();
  }
  
  set displayName(value) {
    this.name = value.toLowerCase();
  }
  
  addItem(item) {
    this.items.push(item);
  }
  
  static createInstance(name) {
    return new MyClass(name);
  }
}
`

test('Round-trip Conversion Test', () => {
  test('Converts JS to JEON and back with direct normalized string comparison', () => {
    console.log('=== Original JS Code ===')
    console.log(code)

    // Convert JS to JEON
    const jeon = js2jeon(code)
    expect(jeon).toBeDefined()
    expect(typeof jeon).toBe('object')

    console.log('\n=== Converted to JEON ===')
    console.log(JSON.stringify(jeon, null, 2))

    // Convert JEON back to JS
    console.log('\n=== Converted back to JS ===')
    try {
      const regeneratedJs = jeon2js(jeon)
      expect(regeneratedJs).toBeDefined()
      expect(typeof regeneratedJs).toBe('string')

      console.log(regeneratedJs)

      // Normalize both codes for comparison
      const normalizedOriginal = normalizeJs(code)
      const normalizedRegenerated = normalizeJs(regeneratedJs)

      console.log('\n=== Normalized Comparison ===')
      console.log('Original:', normalizedOriginal)
      console.log('Regenerated:', normalizedRegenerated)

      // Direct normalized string comparison
      expect(normalizedRegenerated).toBe(normalizedOriginal)

      console.log('\n=== SELF-CHECK RESULT ===')
      console.log('✅ Round-trip conversion completed successfully!')
    } catch (error: any) {
      expect(error).toBeUndefined() // This will fail and show the error
    }
  })
})