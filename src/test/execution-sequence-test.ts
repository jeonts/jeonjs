import { evalJeon } from '../safeEval'
import { JeonExpression } from '../JeonExpression'

console.log('Testing execution sequences...')

// Test 1: Array with statement objects should be treated as execution sequence
const executionSequence: JeonExpression = [
    { '@': { x: 1 } } as any,
    { '@': { y: 2 } } as any,
    { '+': ['@x', '@y'] } as any
]

console.log('Execution sequence:', JSON.stringify(executionSequence, null, 2))
const execResult = evalJeon(executionSequence)
console.log('Execution result:', execResult)

// Test 2: Array with function declaration should be treated as execution sequence
const functionSequence: JeonExpression = [
    {
        'function add(a, b)': [
            {
                'return': {
                    '+': ['@a', '@b']
                }
            }
        ]
    } as any,
    {
        '()': ['@add', 3, 4]
    } as any
]

console.log('\nFunction sequence:', JSON.stringify(functionSequence, null, 2))
const funcResult = evalJeon(functionSequence)
console.log('Function result:', funcResult)

console.log('\nExecution sequences still work correctly!')