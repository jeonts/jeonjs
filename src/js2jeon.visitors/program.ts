import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitProgram(node: acorn.Program & { comments?: any[] }, options?: { json?: typeof JSON }): any {
    // Process each statement and associate comments with them
    if (node.body.length === 1) {
        const result = ast2jeon(node.body[0], options)

        // If there are comments, add them to the result
        if (node.comments && node.comments.length > 0) {
            // Filter out comments that are just whitespace
            const nonEmptyComments = node.comments.filter((comment: any) => comment.value.trim() !== '')
            if (nonEmptyComments.length > 0) {
                // If the result is an object, add comments to it
                if (typeof result === 'object' && result !== null && !Array.isArray(result)) {
                    return {
                        '//': nonEmptyComments.map((comment: any) => comment.value),
                        ...result
                    }
                }
                // For other cases, wrap in an object with comments
                else {
                    return {
                        '//': nonEmptyComments.map((comment: any) => comment.value),
                        'result': result
                    }
                }
            }
        }

        return result
    } else {
        // For multiple statements, we need to associate comments with the correct statements
        const statementsWithComments: any[] = []
        let currentCommentIndex = 0

        // Filter out comments that are just whitespace
        const nonEmptyComments = node.comments ?
            node.comments.filter((comment: any) => comment.value.trim() !== '') : []

        for (let i = 0; i < node.body.length; i++) {
            const stmt = node.body[i]
            const stmtStart = stmt.start

            // Collect comments that come before this statement
            const stmtComments: any[] = []
            while (currentCommentIndex < nonEmptyComments.length &&
                nonEmptyComments[currentCommentIndex].start < stmtStart) {
                stmtComments.push(nonEmptyComments[currentCommentIndex].value)
                currentCommentIndex++
            }

            // Process the statement
            const stmtResult = ast2jeon(stmt, options)

            // If there are comments for this statement, add them
            if (stmtComments.length > 0) {
                if (typeof stmtResult === 'object' && stmtResult !== null && !Array.isArray(stmtResult)) {
                    statementsWithComments.push({
                        '//': stmtComments,
                        ...stmtResult
                    })
                } else {
                    // Wrap non-object results
                    statementsWithComments.push({
                        '//': stmtComments,
                        'statement': stmtResult
                    })
                }
            } else {
                statementsWithComments.push(stmtResult)
            }
        }

        // Add any remaining comments at the end
        const remainingComments: string[] = []
        while (currentCommentIndex < nonEmptyComments.length) {
            remainingComments.push(nonEmptyComments[currentCommentIndex].value)
            currentCommentIndex++
        }

        // If there are remaining comments, add them to the result
        if (remainingComments.length > 0) {
            return {
                'program': statementsWithComments,
                '//': remainingComments
            }
        }

        return statementsWithComments
    }
}