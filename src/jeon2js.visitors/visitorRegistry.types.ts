export interface VisitorRegistry {
    visitString: (jeon: string, jsonImpl?: typeof JSON) => string
    visitPrimitive: (jeon: number | boolean | null, jsonImpl?: typeof JSON) => string
    visitArray: (jeon: any[], visit: (item: any) => string, jsonImpl?: typeof JSON, isTopLevel?: boolean, closure?: boolean) => string
    visitFunctionDeclaration: (keys: string[], jeon: any, visit: (item: any) => string, jsonImpl?: typeof JSON, closure?: boolean) => string | null
    visitVariableDeclaration: (op: string, operands: any, visit: (item: any) => string, jsonImpl?: typeof JSON, closure?: boolean) => string
    visitArrowFunction: (op: string, operands: any, visit: (item: any) => string, jsonImpl?: typeof JSON, closure?: boolean) => string
    visitJSX: (keys: string[], jeon: any, visit: (item: any) => string, jsonImpl?: typeof JSON, closure?: boolean) => string | null
    visitClass: (op: string, operands: any, keys: string[], visit: (item: any) => string, jsonImpl?: typeof JSON, closure?: boolean) => string
    visitTryCatch: (operands: any, visit: (item: any) => string, jsonImpl?: typeof JSON, closure?: boolean) => string
    visitOperator: (op: string, operands: any, visit: (item: any) => string, jsonImpl?: typeof JSON, closure?: boolean) => string
    visitFunctionCall: (keys: string[], jeon: any, visit: (item: any) => string, jsonImpl?: typeof JSON, closure?: boolean) => string
    visitObject: (keys: string[], jeon: any, visit: (item: any) => string, jsonImpl?: typeof JSON, closure?: boolean) => string
    visitPropertyAccess: (op: string, operands: any, visit: (item: any) => string, jsonImpl?: typeof JSON, closure?: boolean) => string
    visitSequencing: (op: string, operands: any, visit: (item: any) => string, jsonImpl?: typeof JSON, closure?: boolean) => string
    visitSwitch: (operands: any, visit: (item: any) => string, jsonImpl?: typeof JSON, closure?: boolean) => string
    visitComment: (node: any) => string
}