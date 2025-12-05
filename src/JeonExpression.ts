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
    '&': JeonArray
    '|': JeonArray
    '^': JeonArray
    '<<': JeonArray
    '>>': JeonArray
    '>>>': JeonArray
    'typeof': JeonValue
    'void': JeonValue
    'delete': JeonValue
    '(': JeonValue
    '?': JeonArray
    '()': JeonArray
    '.': JeonArray
    'new': JeonArray
    '...': JeonValue
    '=': JeonArray
    '+=': JeonArray
    '-=': JeonArray
    '*=': JeonArray
    '/=': JeonArray
    '%=': JeonArray
    '<<=': JeonArray
    '>>=': JeonArray
    '>>>=': JeonArray
    '&=': JeonArray
    '^=': JeonArray
    '|=': JeonArray
    '++': JeonValue
    '--': JeonValue
    '++postfix': JeonValue
    '--postfix': JeonValue
    'if': JeonArray
    'while': JeonArray
    'for': JeonArray
    'function': JeonArray
    'async function': JeonArray
    'function*': JeonArray
    '=>': JeonArray
    'return': JeonValue
    'yield': JeonValue
    'yield*': JeonValue
    'await': JeonValue
    '//': JeonValue
    '/ /': { pattern: string; flags: string } | JeonObject
    ',': JeonArray
}
export type JeonExpression = JeonValue | {
    [K in keyof JeonOperatorMap]: JeonOperatorMap[K]
}