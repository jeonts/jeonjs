import * as acorn from 'acorn'
import { ast2jeon } from './ast2jeon'

export function visitSwitchStatement(node: acorn.SwitchStatement, options?: { json?: typeof JSON }): any {
    const cases = node.cases.map(caseClause => {
        if (caseClause.test) {
            return {
                'case': ast2jeon(caseClause.test, options),
                'body': caseClause.consequent.map(consequent => ast2jeon(consequent, options))
            }
        } else {
            return {
                'default': caseClause.consequent.map(consequent => ast2jeon(consequent, options))
            }
        }
    })
    return {
        'switch': [
            ast2jeon(node.discriminant, options),
            cases
        ]
    }
}