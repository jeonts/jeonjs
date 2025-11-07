/**
 * Type definitions for JEON expressions
 */
type JeonPrimitive = string | number | boolean | null
type JeonArray = JeonValue[]
export type JeonObject = { [key: string]: JeonValue }
type JeonValue = JeonPrimitive | JeonArray | JeonObject
export interface JeonOperatorMap {
    '+': JeonArray
    '-': JeonArray
    '*': JeonArray
    '/': JeonArray
    '%': JeonArray
    '==': JeonArray
    '===': JeonArray
    '!=': JeonArray
    '!==': JeonArray
    '<': JeonArray
    '>': JeonArray
    '<=': JeonArray
    '>=': JeonArray
    '&&': JeonArray
    '||': JeonArray
    '!': JeonValue
    '~': JeonValue
    'typeof': JeonValue
    '(': JeonValue
    '?': JeonArray
    '()': JeonArray
    '.': JeonArray
    'new': JeonArray
    '...': JeonValue
    '=': JeonArray
    'if': JeonArray
    'while': JeonArray
    'for': JeonArray
    'function': JeonArray
    'async function': JeonArray
    '=>': JeonArray
    'return': JeonValue
}
export type JeonExpression = JeonValue | {
    [K in keyof JeonOperatorMap]: JeonOperatorMap[K]
}