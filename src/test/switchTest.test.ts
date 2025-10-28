import { expect, test } from '@woby/chk'
import { jeon2js } from '../jeon2js'
import { js2jeon } from '../js2jeon'
import { normalizeJs } from './testUtils'

test('Switch Test', () => {
  // Test switch statement
  const switchJS = `
function processValue(value) {
  switch (value) {
    case 1:
      return "one";
    case 2:
      return "two";
    default:
      return "unknown";
  }
}
`

  console.log('Testing switch statement conversion...')
  console.log('Original JS:')
  console.log(switchJS)

  test('Converts switch statement to JEON and back', () => {
    try {
      const jeon = js2jeon(switchJS)
      console.log('JEON conversion successful:')
      console.log(JSON.stringify(jeon, null, 2))

      const regeneratedJS = jeon2js(jeon)
      console.log('Regenerated JS:')
      console.log(regeneratedJS)

      // For switch statements, we'll check for key elements rather than direct string comparison
      // because the formatting may change during conversion
      expect(regeneratedJS).toContain('function processValue')
      expect(regeneratedJS).toContain('switch')
      // Check for case values in a more flexible way
      expect(regeneratedJS).toMatch(/case\s+1/)
      expect(regeneratedJS).toMatch(/case\s+2/)
      expect(regeneratedJS).toContain('default')
      expect(regeneratedJS).toContain('return "one"')
      expect(regeneratedJS).toContain('return "two"')
      expect(regeneratedJS).toContain('return "unknown"')

      expect(jeon).toBeDefined()
      expect(regeneratedJS).toBeDefined()
      console.log('Conversion successful!')
    } catch (error) {
      console.error('Error in conversion:', error)
      expect(error).toBeUndefined()
    }
  })
})