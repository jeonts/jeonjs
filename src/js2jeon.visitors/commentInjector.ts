/**
 * Represents a comment node extracted by Acorn
 */
export interface AcornComment {
    type: 'Line' | 'Block'
    value: string
    start: number
    end: number
}

/**
 * Injects comments into the AST nodes based on their position
 * @param ast The AST to inject comments into
 * @param comments Array of comment nodes extracted by Acorn
 * @returns The AST with comments injected
 */
export function injectCommentsIntoAST(ast: any, comments: AcornComment[]): any {
    // Create a copy of the AST to avoid modifying the original
    const astCopy = JSON.parse(JSON.stringify(ast))

    // Sort comments by their start position
    const sortedComments = [...comments].sort((a, b) => a.start - b.start)

    // Add comments to the AST
    if (sortedComments.length > 0) {
        (astCopy as any).comments = sortedComments
    }

    return astCopy
}