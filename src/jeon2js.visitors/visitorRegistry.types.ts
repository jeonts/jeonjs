export interface VisitorRegistry {
    visitString: (jeon: string, jsonImpl?: typeof JSON) => string
    visitPrimitive: (jeon: number | boolean | null, jsonImpl?: typeof JSON) => string
    visitArray: (jeon: any[], visit: (item: any) => string, jsonImpl?: typeof JSON, isTopLevel?: boolean) => string
    visitFunctionDeclaration: (keys: string[], jeon: any, visit: (item: any) => string, jsonImpl?: typeof JSON) => string | null
    visitVariableDeclaration: (op: string, operands: any, visit: (item: any) => string, jsonImpl?: typeof JSON) => string
    visitArrowFunction: (op: string, operands: any, visit: (item: any) => string, jsonImpl?: typeof JSON) => string
    visitJSX: (keys: string[], jeon: any, visit: (item: any) => string, jsonImpl?: typeof JSON, useJsxFunction?: boolean) => string | null
    visitClass: (op: string, operands: any, keys: string[], visit: (item: any) => string, jsonImpl?: typeof JSON) => string
    visitTryCatch: (operands: any, visit: (item: any) => string, jsonImpl?: typeof JSON) => string
    visitOperator: (op: string, operands: any, visit: (item: any) => string, jsonImpl?: typeof JSON) => string
    visitFunctionCall: (keys: string[], jeon: any, visit: (item: any) => string, jsonImpl?: typeof JSON) => string
    visitObject: (keys: string[], jeon: any, visit: (item: any) => string, jsonImpl?: typeof JSON) => string
    visitPropertyAccess: (op: string, operands: any, visit: (item: any) => string, jsonImpl?: typeof JSON) => string
    visitSequencing: (op: string, operands: any, visit: (item: any) => string, jsonImpl?: typeof JSON) => string
    visitSwitch: (operands: any, visit: (item: any) => string, jsonImpl?: typeof JSON) => string
}