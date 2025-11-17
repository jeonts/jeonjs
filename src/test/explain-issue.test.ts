import { expect, test } from '@woby/chk'

test('Explaining the undefined issue in JEON', () => {
    console.log('=== Explaining the undefined issue ===')

    // What you want:
    const desiredJEON = {
        "@": {
            "d": undefined,  // This is what you want to see
            "f": 22
        }
    }

    console.log('1. Desired JEON structure in memory:')
    console.log(desiredJEON)

    // What actually happens when we serialize to JSON:
    console.log('\n2. What happens when we serialize to JSON:')
    const serialized = JSON.stringify(desiredJEON)
    console.log(serialized)

    // What we get when we parse it back:
    console.log('\n3. What we get when we parse it back:')
    const parsed = JSON.parse(serialized)
    console.log(parsed)

    console.log('\n4. The problem:')
    console.log('- Original had "d" property with undefined value')
    console.log('- Serialized JSON omits the "d" property entirely')
    console.log('- Parsed object no longer has the "d" property')
    console.log('- Information about uninitialized variable "d" is lost')

    console.log('\n5. Keys comparison:')
    console.log('Original keys:', Object.keys(desiredJEON['@']))
    console.log('Parsed keys:', Object.keys(parsed['@']))

    console.log('\n6. This is why we need a sentinel value like "@undefined":')
    const workaroundJEON = {
        "@": {
            "d": "@undefined",  // Sentinel value that survives JSON serialization
            "f": 22
        }
    }

    console.log('Workaround JEON:', JSON.stringify(workaroundJEON))
    const workaroundParsed = JSON.parse(JSON.stringify(workaroundJEON))
    console.log('Parsed workaround:', workaroundParsed)
    console.log('Workaround keys:', Object.keys(workaroundParsed['@']))
    console.log('Can detect uninitialized "d":', workaroundParsed['@']['d'] === "@undefined")

    // Assertions
    expect(desiredJEON).toBeDefined()
    expect(serialized).toBeDefined()
    expect(parsed).toBeDefined()
    expect(workaroundJEON).toBeDefined()
    expect(workaroundParsed).toBeDefined()
})