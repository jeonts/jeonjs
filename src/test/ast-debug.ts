import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

// Simple test case to examine AST structure
const jsCode = `
const obj = {
  a: 1,
  // This comment should be associated with b
  b: 2
};
`

console.log('Original JavaScript:')
console.log(jsCode)

// Array to collect comments
const comments: any[] = []

// Parse the code
const Parser = acorn.Parser.extend(jsx())
const ast: any = Parser.parse(jsCode, {
    ecmaVersion: 'latest',
    sourceType: 'module',
    allowReturnOutsideFunction: true,
    preserveParens: true,
    onComment: comments
})

console.log('\n=== AST Structure ===')
function printNode(node: any, indent: string = '') {
    if (!node || typeof node !== 'object') return;
    
    if (typeof node.start === 'number' && typeof node.end === 'number') {
        console.log(`${indent}Node: ${node.type || 'unknown'} [${node.start}-${node.end}]`);
        if (node.type === 'Property') {
            console.log(`${indent}  Key: ${node.key?.name || node.key?.value}`);
        }
    }
    
    // Print children
    for (const key in node) {
        if (node.hasOwnProperty(key) && key !== 'comments' && key !== 'loc' && key !== 'range') {
            const value = node[key];
            if (Array.isArray(value)) {
                if (value.length > 0) {
                    console.log(`${indent}${key}: [${value.length} items]`);
                    value.forEach((item: any, index: number) => {
                        console.log(`${indent}  [${index}]:`);
                        printNode(item, indent + '    ');
                    });
                }
            } else if (value && typeof value === 'object' && !(value instanceof RegExp)) {
                console.log(`${indent}${key}:`);
                printNode(value, indent + '  ');
            }
        }
    }
}

printNode(ast);

console.log('\n=== Comments ===')
comments.forEach((comment, index) => {
    console.log(`Comment #${index}: "${comment.value.trim()}" [${comment.start}-${comment.end}]`);
})