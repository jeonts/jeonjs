/**
 * Helper function to normalize JavaScript code for comparison
 * This function is used in tests to compare original and regenerated code
 * by removing formatting differences that don't affect functionality.
 */
export function normalizeJs(code: string): string {
    if (!code) return ''

    return code
        .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
        .replace(/\s*([{}();,:])\s*/g, '$1') // Remove spaces around punctuation
        .replace(/;}/g, '}') // Remove semicolons before closing braces
        .replace(/;;/g, ';') // Replace double semicolons with single
        .trim() // Trim leading/trailing whitespace
}