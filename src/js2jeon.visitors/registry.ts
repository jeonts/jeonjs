// Registry mapping AST node types to visitor functions
import { visitBinaryExpression } from './binaryExpression'
import { visitUnaryExpression } from './unaryExpression'
import { visitProgram } from './program'
import { visitIdentifier } from './identifier'
import { visitLiteral } from './literal'
import { visitLogicalExpression } from './logicalExpression'
import { visitConditionalExpression } from './conditionalExpression'
import { visitCallExpression } from './callExpression'
import { visitMemberExpression } from './memberExpression'
import { visitArrayExpression } from './arrayExpression'
import { visitObjectExpression } from './objectExpression'
import { visitSpreadElement } from './spreadElement'
import { visitSwitchStatement } from './switchStatement'
import { visitExpressionStatement } from './expressionStatement'
import { visitNewExpression } from './newExpression'
import { visitFunctionDeclaration } from './functionDeclaration'
import { visitFunctionExpression } from './functionExpression'
import { visitArrowFunctionExpression } from './arrowFunctionExpression'
import { visitBlockStatement } from './blockStatement'
import { visitVariableDeclaration } from './variableDeclaration'
import { visitAssignmentExpression } from './assignmentExpression'
import { visitArrayPattern } from './arrayPattern'
import { visitObjectPattern } from './objectPattern'
import { visitUpdateExpression } from './updateExpression'
import { visitIfStatement } from './ifStatement'
import { visitWhileStatement } from './whileStatement'
import { visitForStatement } from './forStatement'
import { visitReturnStatement } from './returnStatement'
import { visitClassDeclaration } from './classDeclaration'
import { visitClassExpression } from './classExpression'
import { visitThisExpression } from './thisExpression'
import { visitMethodDefinition } from './methodDefinition'
import { visitPropertyDefinition } from './propertyDefinition'
import { visitAwaitExpression } from './awaitExpression'
import { visitJSXElement } from './jsxElement'
import { visitJSXText } from './jsxText'
import { visitJSXExpressionContainer } from './jsxExpressionContainer'
import { visitYieldExpression } from './yieldExpression'
import { visitBreakStatement } from './breakStatement'
import { visitTryStatement } from './tryStatement'

// Create wrapper functions that pass options to visitors
const createVisitorWrapper = (visitor: (node: any, options?: { json?: typeof JSON }) => any) => {
    return (node: any, options?: { json?: typeof JSON }) => {
        return visitor(node, options)
    }
}

export const visitorRegistry: Record<string, (node: any, options?: { json?: typeof JSON }) => any> = {
    'BinaryExpression': createVisitorWrapper(visitBinaryExpression),
    'UnaryExpression': (node, options) => visitUnaryExpression(node, options),
    'Program': (node, options) => visitProgram(node, options),
    'Identifier': (node, options) => visitIdentifier(node, options),
    'Literal': (node, options) => visitLiteral(node, options),
    'LogicalExpression': (node, options) => visitLogicalExpression(node, options),
    'ConditionalExpression': (node, options) => visitConditionalExpression(node, options),
    'CallExpression': (node, options) => visitCallExpression(node, options),
    'MemberExpression': (node, options) => visitMemberExpression(node, options),
    'ArrayExpression': (node, options) => visitArrayExpression(node, options),
    'ObjectExpression': (node, options) => visitObjectExpression(node, options),
    'SpreadElement': (node, options) => visitSpreadElement(node, options),
    'SwitchStatement': (node, options) => visitSwitchStatement(node, options),
    'ExpressionStatement': (node, options) => visitExpressionStatement(node, options),
    'NewExpression': (node, options) => visitNewExpression(node, options),
    'FunctionDeclaration': (node, options) => visitFunctionDeclaration(node, options),
    'FunctionExpression': (node, options) => visitFunctionExpression(node, options),
    'ArrowFunctionExpression': (node, options) => visitArrowFunctionExpression(node, options),
    'BlockStatement': (node, options) => visitBlockStatement(node, options),
    'VariableDeclaration': (node, options) => visitVariableDeclaration(node, options),
    'AssignmentExpression': (node, options) => visitAssignmentExpression(node, options),
    'ArrayPattern': (node, options) => visitArrayPattern(node, options),
    'ObjectPattern': (node, options) => visitObjectPattern(node, options),
    'UpdateExpression': (node, options) => visitUpdateExpression(node, options),
    'IfStatement': (node, options) => visitIfStatement(node, options),
    'WhileStatement': (node, options) => visitWhileStatement(node, options),
    'ForStatement': (node, options) => visitForStatement(node, options),
    'ReturnStatement': (node, options) => visitReturnStatement(node, options),
    'ClassDeclaration': (node, options) => visitClassDeclaration(node, options),
    'ClassExpression': (node, options) => visitClassExpression(node, options),
    'ThisExpression': (node, options) => visitThisExpression(node, options),
    'MethodDefinition': (node, options) => visitMethodDefinition(node, options),
    'PropertyDefinition': (node, options) => visitPropertyDefinition(node, options),
    'AwaitExpression': (node, options) => visitAwaitExpression(node, options),
    'JSXElement': (node, options) => visitJSXElement(node, options),
    'JSXText': (node, options) => visitJSXText(node, options),
    'JSXExpressionContainer': (node, options) => visitJSXExpressionContainer(node, options),
    'YieldExpression': (node, options) => visitYieldExpression(node, options),
    'BreakStatement': (node, options) => visitBreakStatement(node, options),
    'TryStatement': (node, options) => visitTryStatement(node, options),
}