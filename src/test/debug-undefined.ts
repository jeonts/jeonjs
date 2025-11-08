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