const key = "function greet(name)"
const nameMatch = key.match(/function\*?\s+(\w+)/)
console.log('Key:', key)
console.log('Match result:', nameMatch)
if (nameMatch) {
    console.log('Function name:', nameMatch[1])
} else {
    console.log('No match found')
}