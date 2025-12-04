// Function to convert non-IIFE code to IIFE with proper return handling
// Wraps statements and returns expressions, with special handling for the last line
//
// IIFE/REPL Specification:
// 1. Class expressions (both named and anonymous) are wrapped in parentheses to match REPL behavior:
//    - class {} -> return (class {})
//    - class A{} -> return A (the class name)
//
// 2. Function expressions are wrapped in parentheses to match REPL behavior:
//    - function (){} -> return (function (){})
//    - function A(){} -> return A (the function name)
//
// 3. Array and object literals that might cause parse errors are handled appropriately:
//    - Array literals [,,,] -> return [,,,] (no parentheses needed)
//    - Object literals {...} -> return ({...}) (wrapped in parentheses to distinguish from block statements)
//
// 4. Last line/statement behavior:
//    - Expressions: return the expression directly
//    - Variable declarations: return the last declared variable value
//    - Declarations without initializers: return void 0
//    - Explicit return statements: maintained as-is
import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

// Attempt to parse code, and if it fails, try wrapping in parentheses and re-parse
function tryParseWithFallback(code: string, Parser: any): any {
    // First, try to parse as-is
    try {
        return Parser.parse(code, {
            ecmaVersion: 'latest',
            sourceType: 'module',
            allowReturnOutsideFunction: true,
            preserveParens: true
        })
    } catch (error) {
        // If parsing fails, try wrapping the entire code in parentheses
        try {
            const wrappedCode = `(${code})`
            return Parser.parse(wrappedCode, {
                ecmaVersion: 'latest',
                sourceType: 'module',
                allowReturnOutsideFunction: true,
                preserveParens: true
            })
        } catch (innerError) {
            // If both attempts fail, re-throw the original error
            throw error
        }
    }
}

export function convertToIIFE(code: string): string {
    try {
        const Parser = acorn.Parser.extend(jsx())
        // Try parsing, and if it fails, try wrapping in parentheses
        let ast: any
        let wasWrapped = false
        let processedCode = code

        // First, try to parse as-is
        try {
            ast = Parser.parse(code, {
                ecmaVersion: 'latest',
                sourceType: 'module',
                allowReturnOutsideFunction: true,
                preserveParens: true
            })

            // Special case: if we have a single statement that might be better treated as an expression
            // Check for bare literals that would benefit from being wrapped
            if (ast.body.length === 1) {
                const firstStatement = ast.body[0]

                // Check for bare object literals {} which parse as BlockStatement
                if (firstStatement.type === 'BlockStatement') {
                    // This is a special case for bare object literals {}
                    // Try re-parsing with parentheses
                    try {
                        processedCode = `(${code})`
                        const wrappedAst = Parser.parse(processedCode, {
                            ecmaVersion: 'latest',
                            sourceType: 'module',
                            allowReturnOutsideFunction: true,
                            preserveParens: true
                        })
                        ast = wrappedAst
                        wasWrapped = true
                    } catch (innerError) {
                        // If wrapping fails, stick with the original AST
                    }
                }
                // Check for bare array literals [] or object literals {} that failed to parse
                else if (firstStatement.type === 'ExpressionStatement') {
                    // If it's already an expression statement, we might still want to wrap it
                    // in some cases for consistency with REPL behavior
                }
            }
        } catch (error) {
            // If parsing fails, try wrapping the entire code in parentheses
            try {
                processedCode = `(${code})`
                ast = Parser.parse(processedCode, {
                    ecmaVersion: 'latest',
                    sourceType: 'module',
                    allowReturnOutsideFunction: true,
                    preserveParens: true
                })
                wasWrapped = true
            } catch (innerError) {
                // If both attempts fail, re-throw the original error
                throw error
            }
        }

        // Check if it's already an IIFE
        if (!wasWrapped && ast.body.length === 1 &&
            ast.body[0].type === 'ExpressionStatement' &&
            ast.body[0].expression.type === 'CallExpression' &&
            ast.body[0].expression.arguments.length === 0) {

            let callee = ast.body[0].expression.callee
            if (callee.type === 'ParenthesizedExpression') {
                callee = callee.expression
            }

            if (callee.type === 'FunctionExpression' || callee.type === 'ArrowFunctionExpression') {
                // Already an IIFE, return as-is
                return code
            }
        }

        // For non-IIFE code, we need to wrap it in an IIFE
        // First, let's analyze the last statement to determine what to return

        if (ast.body.length === 0) {
            // Empty code
            return `(() => {})()`
        }

        // Get the last statement
        const lastStatement = ast.body[ast.body.length - 1]

        // If we wrapped the code in parentheses, treat it as a single expression
        if (wasWrapped) {
            // For wrapped expressions, return the expression directly
            // Keep the outer parentheses we added for parsing as they match REPL behavior
            return `(() => {\n  return ${processedCode};\n})()`
        }

        // Determine what the IIFE should return based on the last statement
        let returnExpression = ''
        let needsReturnAdded = true

        switch (lastStatement.type) {
            case 'ExpressionStatement':
                // For expression statements, return the expression value
                // We need to reconstruct the expression from the code
                const start = lastStatement.expression.start
                const end = lastStatement.expression.end
                const expressionText = code.substring(start, end)
                returnExpression = `return ${expressionText};`
                break

            case 'VariableDeclaration':
                // For variable declarations, return the last declared variable value
                // If no initializer, return void
                if (lastStatement.declarations.length > 0) {
                    const lastDecl = lastStatement.declarations[lastStatement.declarations.length - 1]
                    if (lastDecl.init) {
                        // Has initializer, return the variable name
                        if (lastDecl.id && lastDecl.id.name) {
                            returnExpression = `return ${lastDecl.id.name};`
                        } else {
                            returnExpression = '' // No return
                        }
                    } else {
                        // No initializer, return void
                        returnExpression = 'return void 0;'
                    }
                } else {
                    returnExpression = '' // No return
                }
                break

            case 'FunctionDeclaration':
                // For function declarations, return the function name
                if (lastStatement.id && lastStatement.id.name) {
                    returnExpression = `return ${lastStatement.id.name};`
                } else {
                    // For anonymous functions, return the function wrapped in parentheses
                    const funcStart = lastStatement.start
                    const funcEnd = lastStatement.end
                    const funcText = code.substring(funcStart, funcEnd)
                    // Wrap function expressions in parentheses to match REPL behavior
                    returnExpression = `return (${funcText});`
                }
                break

            case 'ClassDeclaration':
                // For class declarations, return the class name
                if (lastStatement.id && lastStatement.id.name) {
                    returnExpression = `return ${lastStatement.id.name};`
                } else {
                    // For anonymous classes, return the class wrapped in parentheses
                    const classStart = lastStatement.start
                    const classEnd = lastStatement.end
                    const classText = code.substring(classStart, classEnd)
                    // Wrap class expressions in parentheses to match REPL behavior
                    returnExpression = `return (${classText});`
                }
                break

            case 'ReturnStatement':
                // Already has a return statement, no need to add another
                returnExpression = '' // Don't add another return
                needsReturnAdded = false // Return statement already exists
                break

            default:
                // For other statement types, try to return the last line if it's an expression
                // Otherwise, no automatic return
                returnExpression = ''
        }

        // Process the code body
        let lines = code.split('\n')

        // Add return statement if needed
        if (returnExpression && needsReturnAdded) {
            // For expression statements, we want to convert the last line to a return
            if (lastStatement.type === 'ExpressionStatement') {
                // Find the line that contains the last statement and replace it with return
                const lastStmtStartLine = code.substring(0, lastStatement.start).split('\n').length - 1
                const lastStmtEndLine = code.substring(0, lastStatement.end).split('\n').length - 1

                // Replace the last statement line with the return expression
                if (lastStmtStartLine === lastStmtEndLine && lastStmtStartLine >= 0 && lastStmtStartLine < lines.length) {
                    lines[lastStmtStartLine] = returnExpression.trim()
                } else {
                    // Fallback: just add the return at the end
                    lines.push(returnExpression)
                }
            } else {
                // For other cases, just add the return statement at the end
                lines.push(returnExpression)
            }
        }

        // Indent all lines
        const indentedLines = lines.map(line => line ? `  ${line}` : '')

        // Create the IIFE
        return `(() => {\n${indentedLines.join('\n')}\n})()`

    } catch (error) {
        console.error('Error parsing code:', error)
        // If parsing fails, wrap as-is
        const indentedCode = code.split('\n').map(line => line ? `  ${line}` : '').join('\n')
        return `(() => {\n${indentedCode}\n})()`
    }
}