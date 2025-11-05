import { visitString } from './stringVisitor'
import { visitPrimitive } from './primitiveVisitor'
import { visitArray } from './arrayVisitor'
import { visitFunctionDeclaration } from './functionDeclarationVisitor'
import { visitVariableDeclaration } from './variableDeclarationVisitor'
import { visitArrowFunction } from './arrowFunctionVisitor'
import { visitJSX } from './jsxVisitor'
import { visitClass } from './classVisitor'
import { visitTryCatch } from './tryCatchVisitor'
import { visitOperator } from './operatorVisitor'
import { visitFunctionCall } from './functionCallVisitor'
import { visitObject } from './objectVisitor'
import { visitPropertyAccess } from './propertyAccessVisitor'
import { visitSequencing } from './sequencingVisitor'
import { visitSwitch } from './switchVisitor'
import { VisitorRegistry } from './visitorRegistry.types'

export const visitorRegistry: VisitorRegistry = {
    visitString,
    visitPrimitive,
    visitArray,
    visitFunctionDeclaration,
    visitVariableDeclaration,
    visitArrowFunction,
    visitJSX,
    visitClass,
    visitTryCatch,
    visitOperator,
    visitFunctionCall,
    visitObject,
    visitPropertyAccess,
    visitSequencing,
    visitSwitch
}