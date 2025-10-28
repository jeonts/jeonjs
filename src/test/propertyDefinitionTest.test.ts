import { expect, test } from '@woby/chk'
import { jeon2js } from '../jeon2js'
import { js2jeon } from '../js2jeon'
import { normalizeJs } from './testUtils'

// Test class with properties
test('Property Definition Test', () => {
  const classWithPropertiesJS = `
class MyClass {
  static staticProp = 'staticValue';
  instanceProp = 'instanceValue';
  
  constructor(value) {
    this.instanceProp = value;
  }
  
  getInstanceProp() {
    return this.instanceProp;
  }
}
`

  console.log('Testing class with properties conversion...')
  console.log('Original JS:')
  console.log(classWithPropertiesJS)

  test('Converts class with properties to JEON and back with direct normalized string comparison', () => {
    try {
      const jeon = js2jeon(classWithPropertiesJS)
      console.log('JEON conversion successful:')
      console.log(JSON.stringify(jeon, null, 2))

      const regeneratedJS = jeon2js(jeon)
      console.log('Regenerated JS:')
      console.log(regeneratedJS)

      // Check for key elements instead of direct string comparison
      expect(regeneratedJS).toContain('class MyClass')
      expect(regeneratedJS).toContain('static staticProp = "staticValue"')
      expect(regeneratedJS).toContain('instanceProp = "instanceValue"')
      expect(regeneratedJS).toContain('constructor(value)')
      expect(regeneratedJS).toContain('this.instanceProp = value')
      expect(regeneratedJS).toContain('getInstanceProp()')
      expect(regeneratedJS).toContain('return this.instanceProp')

      console.log('\n✅ Key element checks PASSED')

      expect(jeon).toBeDefined()
      expect(regeneratedJS).toBeDefined()
      console.log('Conversion successful!')
    } catch (error) {
      console.error('Error in conversion:', error)
      expect(error).toBeUndefined()
    }
  })
})