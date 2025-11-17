import { expect, test } from '@woby/chk'

test('Debug how JSON handles undefined values', () => {
    // Test how JSON handles undefined values
    const obj = {
        "d": undefined
    }

    console.log('Object with undefined:')
    console.log(obj)

    console.log('JSON.stringify result:')
    console.log(JSON.stringify(obj))

    // Test with null instead
    const obj2 = {
        "d": null
    }

    console.log('\nObject with null:')
    console.log(obj2)

    console.log('JSON.stringify result:')
    console.log(JSON.stringify(obj2))

    // Assertions
    expect(obj).toBeDefined()
    expect(obj2).toBeDefined()
    expect(JSON.stringify(obj)).toBe('{}') // undefined properties are omitted
    expect(JSON.stringify(obj2)).toBe('{"d":null}') // null properties are preserved
})