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

export const visitorRegistry = {
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
    visitSequencing
}