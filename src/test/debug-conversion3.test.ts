import { expect, test } from '@woby/chk'

test('Debug conversion 3 manual trace of uninitialized variable logic', () => {
    // Let's manually trace through what should happen
    const nodeName = 'd'
    const initValue = null // This is what we get from the AST for uninitialized variables

    console.log('Variable name:', nodeName)
    console.log('Init value:', initValue)
    console.log('Init value is null:', initValue === null)
    console.log('Init value truthiness:', !!initValue)

    // Simulate the logic from ast2jeon.ts
    const key = ('let' as string) === 'const' ? '@@' : '@' // This will be '@'
    console.log('Key:', key)

    const declarations: Record<string, any> = {}
    declarations[nodeName] = initValue ? 'some value' : null
    console.log('Declarations object:', declarations)

    const result = {
        [key]: declarations
    }
    console.log('Result object:', result)

    console.log('JSON.stringify result:')
    console.log(JSON.stringify(result, null, 2))

    // Assertions
    expect(nodeName).toBe('d')
    expect(initValue).toBeNull()
    expect(key).toBe('@')
    expect(result).toBeDefined()
    expect(result[key]).toBeDefined()
    expect(result[key][nodeName]).toBeNull()
})